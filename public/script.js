class InvestmentTracker {
    constructor() {
        this.initialBalance = 50.00;
        this.currentBalance = 50.00;
        this.dailyProfit = 0.00;
        this.operationsToday = 0;
        this.maxOperations = 3;
        this.consecutiveLosses = 0;
        this.maxLosses = 2;
        this.payoutRates = {
            'win-90': 0.90,
            'win-96': 0.96,
            'win-85': 0.85,
            'win-87': 0.87
        };
        this.operations = [];
        this.currentDate = new Date().toISOString().split('T')[0];
        
        this.initializeElements();
        this.attachEventListeners();
        
        // Inicializar dados do Supabase
        this.initializeSupabase();
    }
    
    async initializeSupabase() {
        try {
            // Verificar se as tabelas existem, se não, mostrar aviso
            const { error } = await window.supabase
                .from('daily_config')
                .select('count', { count: 'exact', head: true });
            
            if (error) {
                console.error('Erro ao conectar com Supabase:', error);
                alert('Erro na conexão com o banco de dados. Verifique a configuração do Supabase.');
                return;
            }
            
            await this.loadDataFromSupabase();
        } catch (error) {
            console.error('Erro na inicialização:', error);
            this.updateDisplay();
        }
    }
    
    async loadDataFromSupabase() {
        try {
            // Carregar configurações do dia atual
            const { data: configData, error: configError } = await window.supabase
                .from('daily_config')
                .select('*')
                .eq('date', this.currentDate)
                .single();
            
            if (configData && !configError) {
                this.initialBalance = configData.initial_balance;
                this.currentBalance = configData.current_balance;
                this.dailyProfit = configData.daily_profit;
                this.operationsToday = configData.operations_count;
                this.consecutiveLosses = configData.consecutive_losses;
            }
            
            // Carregar operações do dia atual
            const { data: operationsData, error: operationsError } = await window.supabase
                .from('operations')
                .select('*')
                .eq('date', this.currentDate)
                .order('created_at', { ascending: true });
            
            if (operationsData && !operationsError) {
                this.operations = operationsData.map(op => ({
                    time: new Date(op.created_at).toLocaleTimeString('pt-BR'),
                    value: op.value,
                    type: op.type,
                    result: op.result,
                    balance: op.balance
                }));
            }
            
            this.updateDisplay();
            this.updateOperationsTable();
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            this.updateDisplay();
        }
    }
    
    async saveDailyConfig() {
        try {
            const configData = {
                date: this.currentDate,
                initial_balance: this.initialBalance,
                current_balance: this.currentBalance,
                daily_profit: this.dailyProfit,
                operations_count: this.operationsToday,
                consecutive_losses: this.consecutiveLosses
            };
            
            const { error } = await window.supabase
                .from('daily_config')
                .upsert(configData, { onConflict: 'date' });
            
            if (error) {
                console.error('Erro ao salvar configuração:', error);
            }
        } catch (error) {
            console.error('Erro ao salvar configuração:', error);
        }
    }
    
    async saveOperation(operation) {
        try {
            const operationData = {
                date: this.currentDate,
                value: operation.value,
                type: operation.type,
                result: operation.result,
                balance: operation.balance,
                created_at: new Date().toISOString()
            };
            
            const { error } = await window.supabase
                .from('operations')
                .insert([operationData]);
            
            if (error) {
                console.error('Erro ao salvar operação:', error);
            }
        } catch (error) {
            console.error('Erro ao salvar operação:', error);
        }
    }
    
    initializeElements() {
        this.elements = {
            currentBalance: document.getElementById('currentBalance'),
            dailyProfit: document.getElementById('dailyProfit'),
            operationsCount: document.getElementById('operationsCount'),
            lossesCount: document.getElementById('lossesCount'),
            statusIndicator: document.getElementById('statusIndicator'),
            operationValue: document.getElementById('operationValue'),
            operationType: document.getElementById('operationType'),
            addOperation: document.getElementById('addOperation'),
            operationsBody: document.getElementById('operationsBody'),
            resetDay: document.getElementById('resetDay'),
            newDay: document.getElementById('newDay')
        };
    }
    
    attachEventListeners() {
        this.elements.addOperation.addEventListener('click', () => this.addOperation());
        this.elements.resetDay.addEventListener('click', () => this.resetDay());
        this.elements.newDay.addEventListener('click', () => this.newDay());
        
        // Enter key support
        this.elements.operationValue.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addOperation();
        });
    }
    
    canOperate() {
        return this.operationsToday < this.maxOperations && 
               this.consecutiveLosses < this.maxLosses &&
               this.currentBalance > 0;
    }
    
    async addOperation() {
        if (!this.canOperate()) {
            alert('Não é possível realizar mais operações hoje!');
            return;
        }
        
        const value = parseFloat(this.elements.operationValue.value);
        const type = this.elements.operationType.value;
        
        if (!value || value <= 0) {
            alert('Por favor, insira um valor válido para a operação.');
            return;
        }
        
        if (!type) {
            alert('Por favor, selecione o resultado da operação.');
            return;
        }
        
        if (value > this.currentBalance) {
            alert('Valor da operação não pode ser maior que o saldo atual.');
            return;
        }
        
        const operation = await this.processOperation(value, type);
        await this.saveOperation(operation);
        await this.saveDailyConfig();
        
        this.clearForm();
        this.updateDisplay();
        this.updateOperationsTable();
    }
    
    async processOperation(value, type) {
        const operation = {
            time: new Date().toLocaleTimeString('pt-BR'),
            value: value,
            type: type,
            result: 0,
            balance: 0
        };
        
        if (type.startsWith('win')) {
            const payoutRate = this.payoutRates[type] || 0.90;
            operation.result = value * payoutRate;
            this.currentBalance += operation.result;
            this.dailyProfit += operation.result;
            this.consecutiveLosses = 0;
        } else {
            operation.result = -value;
            this.currentBalance -= value;
            this.dailyProfit -= value;
            this.consecutiveLosses++;
        }
        
        operation.balance = this.currentBalance;
        this.operations.push(operation);
        this.operationsToday++;
        
        return operation;
    }
    
    updateDisplay() {
        this.elements.currentBalance.textContent = `$${this.currentBalance.toFixed(2)}`;
        this.elements.dailyProfit.textContent = `$${this.dailyProfit.toFixed(2)}`;
        this.elements.operationsCount.textContent = `${this.operationsToday}/${this.maxOperations}`;
        this.elements.lossesCount.textContent = `${this.consecutiveLosses}/${this.maxLosses}`;
        
        // Update status
        const statusText = this.elements.statusIndicator.querySelector('.status-text');
        const canOperate = this.canOperate();
        
        if (!canOperate) {
            if (this.consecutiveLosses >= this.maxLosses) {
                statusText.textContent = 'Bloqueado: 2 perdas consecutivas';
                statusText.className = 'status-text status-blocked';
            } else if (this.operationsToday >= this.maxOperations) {
                statusText.textContent = 'Limite de operações atingido';
                statusText.className = 'status-text status-blocked';
            } else if (this.currentBalance <= 0) {
                statusText.textContent = 'Saldo insuficiente';
                statusText.className = 'status-text status-blocked';
            }
        } else {
            if (this.dailyProfit >= 10) {
                statusText.textContent = 'Meta diária atingida! 🎉';
                statusText.className = 'status-text status-warning';
            } else if (this.consecutiveLosses === 1) {
                statusText.textContent = 'Atenção: 1 perda consecutiva';
                statusText.className = 'status-text status-warning';
            } else {
                statusText.textContent = 'Pronto para operar';
                statusText.className = 'status-text';
            }
        }
        
        // Enable/disable operation button
        this.elements.addOperation.disabled = !canOperate;
        
        // Update profit color
        const profitElement = this.elements.dailyProfit;
        if (this.dailyProfit > 0) {
            profitElement.style.color = '#27ae60';
        } else if (this.dailyProfit < 0) {
            profitElement.style.color = '#e74c3c';
        } else {
            profitElement.style.color = '#2c3e50';
        }
    }
    
    updateOperationsTable() {
        const tbody = this.elements.operationsBody;
        tbody.innerHTML = '';
        
        this.operations.forEach(operation => {
            const row = document.createElement('tr');
            const isWin = operation.type.startsWith('win');
            const resultClass = isWin ? 'win' : 'loss';
            
            let resultText = 'Perda';
            if (isWin) {
                const payout = operation.type.split('-')[1];
                resultText = `Vitória (${payout}%)`;
            }
            
            row.innerHTML = `
                <td>${operation.time}</td>
                <td>$${operation.value.toFixed(2)}</td>
                <td class="${resultClass}">${resultText}</td>
                <td class="${resultClass}">$${operation.result.toFixed(2)}</td>
                <td>$${operation.balance.toFixed(2)}</td>
            `;
            
            tbody.appendChild(row);
        });
    }
    
    clearForm() {
        this.elements.operationValue.value = '';
        this.elements.operationType.value = '';
    }
    
    async resetDay() {
        if (confirm('Tem certeza que deseja resetar o dia atual? Todos os dados serão perdidos.')) {
            try {
                // Deletar operações do dia atual
                await window.supabase
                    .from('operations')
                    .delete()
                    .eq('date', this.currentDate);
                
                // Resetar configuração do dia
                this.currentBalance = this.initialBalance;
                this.dailyProfit = 0;
                this.operationsToday = 0;
                this.consecutiveLosses = 0;
                this.operations = [];
                
                await this.saveDailyConfig();
                
                this.updateDisplay();
                this.updateOperationsTable();
            } catch (error) {
                console.error('Erro ao resetar dia:', error);
                alert('Erro ao resetar o dia. Tente novamente.');
            }
        }
    }
    
    async newDay() {
        if (confirm('Iniciar um novo dia? O saldo atual será mantido como saldo inicial.')) {
            try {
                this.initialBalance = this.currentBalance;
                this.dailyProfit = 0;
                this.operationsToday = 0;
                this.consecutiveLosses = 0;
                this.operations = [];
                
                // Atualizar a data para hoje
                this.currentDate = new Date().toISOString().split('T')[0];
                
                await this.saveDailyConfig();
                
                this.updateDisplay();
                this.updateOperationsTable();
            } catch (error) {
                console.error('Erro ao iniciar novo dia:', error);
                alert('Erro ao iniciar novo dia. Tente novamente.');
            }
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new InvestmentTracker();
});