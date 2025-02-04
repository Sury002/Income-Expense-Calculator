document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('entry-form');
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const typeInput = document.getElementById('type');
    const entriesList = document.getElementById('entries-list');
    const totalIncome = document.getElementById('total-income');
    const totalExpense = document.getElementById('total-expense');
    const netBalance = document.getElementById('net-balance');
    const resetBtn = document.getElementById('reset-btn');
    const filters = document.querySelectorAll('input[name="filter"]');
  
    let entries = JSON.parse(localStorage.getItem('entries')) || [];
  
    const renderEntries = (filter = 'all') => {
      entriesList.innerHTML = '';
      const filteredEntries = filter === 'all' ? entries : entries.filter(entry => entry.type === filter);
  
      filteredEntries.forEach((entry, index) => {
        const li = document.createElement('li');
        li.className = 'flex justify-between items-center bg-gray-100 p-2 rounded';
        li.innerHTML = `
          <span>${entry.description}: $${entry.amount} (${entry.type})</span>
          <div>
            <button onclick="editEntry(${index})" class="bg-yellow-400 text-white px-2 py-1 rounded">Edit</button>
            <button onclick="deleteEntry(${index})" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
          </div>
        `;
        entriesList.appendChild(li);
      });
      updateSummary();
    };
  
    const updateSummary = () => {
      const income = entries.filter(entry => entry.type === 'income').reduce((sum, entry) => sum + entry.amount, 0);
      const expense = entries.filter(entry => entry.type === 'expense').reduce((sum, entry) => sum + entry.amount, 0);
      totalIncome.textContent = `$${income}`;
      totalExpense.textContent = `$${expense}`;
      netBalance.textContent = `$${income - expense}`;
    };
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const description = descriptionInput.value.trim();
      const amount = parseFloat(amountInput.value);
      const type = typeInput.value;
  
      if (description && !isNaN(amount) && type) {
        entries.push({ description, amount, type });
        localStorage.setItem('entries', JSON.stringify(entries));
        renderEntries();
        form.reset();
      }
    });
  
    window.editEntry = (index) => {
      const entry = entries[index];
      descriptionInput.value = entry.description;
      amountInput.value = entry.amount;
      typeInput.value = entry.type;
      entries.splice(index, 1);
      localStorage.setItem('entries', JSON.stringify(entries));
      renderEntries();
    };
  
    window.deleteEntry = (index) => {
      if (confirm('Are you sure you want to delete this entry?')) {
        entries.splice(index, 1);
        localStorage.setItem('entries', JSON.stringify(entries));
        renderEntries();
      }
    };
  
    resetBtn.addEventListener('click', () => {
      form.reset();
    });
  
    filters.forEach(filter => {
      filter.addEventListener('change', (e) => {
        renderEntries(e.target.value);
      });
    });
  
    renderEntries();
  });
  