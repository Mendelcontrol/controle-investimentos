class InvestmentTracker {
    constructor() {
        this.initialBalance = 50.00;
        this.currentBalance = 50.00;
        this.dailyProfit = 0.00;
        this.operationsToday = 0;
        this.maxOperations = 3;
        this.consecutiveLosses = 0;
        this.maxLosses = 2;
        this.payoutRate = 0.90; // 90%
        this.operations = [];
        
        this.initializeElements();
        this.attachEventListeners();
        this.updateDisplay();
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
    
    addOperation() {
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
        
        this.processOperation(value, type);
        this.clearForm();
        this.updateDisplay();
        this.updateOperationsTable();
    }
    
    processOperation(value, type) {
        const operation = {
            time: new Date().toLocaleTimeString('pt-BR'),
            value: value,
            type: type,
            result: 0,
            balance: 0
        };
        
        if (type === 'win') {
            operation.result = value * this.payoutRate;
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
            const resultClass = operation.type === 'win' ? 'win' : 'loss';
            const resultText = operation.type === 'win' ? 'Vitória' : 'Perda';
            
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
    
    resetDay() {
        if (confirm('Tem certeza que deseja resetar o dia atual? Todos os dados serão perdidos.')) {
            this.currentBalance = this.initialBalance;
            this.dailyProfit = 0;
            this.operationsToday = 0;
            this.consecutiveLosses = 0;
            this.operations = [];
            this.updateDisplay();
            this.updateOperationsTable();
        }
    }
    
    newDay() {
        if (confirm('Iniciar um novo dia? O saldo atual será mantido como saldo inicial.')) {
            this.initialBalance = this.currentBalance;
            this.dailyProfit = 0;
            this.operationsToday = 0;
            this.consecutiveLosses = 0;
            this.operations = [];
            this.updateDisplay();
            this.updateOperationsTable();
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new InvestmentTracker();
});
async function registrarOperacao(valor, resultado) {
  const resposta = await fetch('/api/operacao', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ valor, resultado }),
  });

  const dados = await resposta.json();
  console.log(dados);
}
