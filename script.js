// ذخیره و بازیابی حالت تاریک
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark');
    localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
}

function loadTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark', theme === 'dark');
}

// مدیریت تب‌ها
function showTab(tabName) {
    document.getElementById('todoContent').classList.toggle('hidden', tabName !== 'todo');
    document.getElementById('archiveContent').classList.toggle('hidden', tabName !== 'archive');
    document.getElementById('todoTab').classList.toggle('active-tab', tabName === 'todo');
    document.getElementById('archiveTab').classList.toggle('active-tab', tabName === 'archive');
}

// ذخیره و بازیابی داده‌ها
function saveData() {
    const groups = [];
    document.querySelectorAll('#groups .group').forEach(group => {
        const groupName = group.querySelector('h3').textContent.trim();
        const items = [];
        group.querySelectorAll('ul li').forEach(item => {
            items.push(item.textContent.trim());
        });
        groups.push({ name: groupName, items });
    });

    const archiveGroups = [];
    document.querySelectorAll('#archiveGroups .group').forEach(group => {
        const groupName = group.querySelector('h3').textContent.trim();
        const items = [];
        group.querySelectorAll('ul li').forEach(item => {
            items.push(item.textContent.trim());
        });
        archiveGroups.push({ name: groupName, items });
    });

    localStorage.setItem('todoData', JSON.stringify(groups));
    localStorage.setItem('archiveData', JSON.stringify(archiveGroups));
}

function loadData() {
    const todoData = JSON.parse(localStorage.getItem('todoData') || '[]');
    const archiveData = JSON.parse(localStorage.getItem('archiveData') || '[]');

    todoData.forEach(group => addGroup(group.name, group.items));
    archiveData.forEach(group => addGroup(group.name, group.items, true));
}

// افزودن گروه
function addGroup(name, items = [], isArchive = false) {
    if (!name) {
        const groupNameInput = document.getElementById('groupName');
        name = groupNameInput.value.trim();
        if (!name) {
            alert('لطفاً نام گروه را وارد کنید!');
            return;
        }
        groupNameInput.value = '';
    }

    const container = isArchive ? document.getElementById('archiveGroups') : document.getElementById('groups');
    const groupDiv = document.createElement('div');
    groupDiv.className = 'group';
    groupDiv.innerHTML = `
        <h3>${name} <button onclick="deleteGroup(this)">حذف گروه</button></h3>
        <ul></ul>
        ${isArchive ? '' : `
            <div class="add-item">
                <input type="text" placeholder="افزودن آیتم جدید">
                <button onclick="addItem(this)">افزودن</button>
            </div>
        `}
    `;
    items.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `${item} ${isArchive ? '<button onclick="deleteItem(this)">حذف</button>' : `
            <button onclick="archiveItem(this)">آرشیو</button>
            <button onclick="deleteItem(this)">حذف</button>
        `}`;
        groupDiv.querySelector('ul').appendChild(li);
    });
    container.appendChild(groupDiv);

    saveData();
}

// افزودن و حذف آیتم‌ها
function addItem(button) {
    const input = button.previousElementSibling;
    const text = input.value.trim();
    if (text) {
        const li = document.createElement('li');
        li.innerHTML = `${text} <button onclick="archiveItem(this)">آرشیو</button><button onclick="deleteItem(this)">حذف</button>`;
        button.closest('.group').querySelector('ul').appendChild(li);
        input.value = '';
        saveData();
    }
}

function deleteGroup(button) {
    button.closest('.group').remove();
    saveData();
}

function deleteItem(button) {
    button.closest('li').remove();
    saveData();
}

function archiveItem(button) {
    const group = button.closest('.group');
    const groupName = group.querySelector('h3').firstChild.textContent.trim(); // نام گروه
    const li = button.closest('li');
    const itemText = li.firstChild.textContent.trim(); // متن آیتم
    li.remove(); // حذف آیتم از لیست
    addGroup(groupName, [itemText], true); // افزودن آیتم به آرشیو
    saveData(); // ذخیره داده‌ها
}

// بارگذاری داده‌ها و تم هنگام لود شدن صفحه
window.onload = () => {
    loadTheme();
    loadData();
    showTab('todo');
};
