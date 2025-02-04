// تابع برای ذخیره داده‌ها در localStorage
function saveData() {
    const groups = [];
    document.querySelectorAll('.group').forEach(group => {
        const groupName = group.querySelector('h3').firstChild.textContent.trim();
        const items = [];
        group.querySelectorAll('li').forEach(item => {
            items.push(item.firstChild.textContent.trim());
        });
        groups.push({ name: groupName, items: items });
    });
    localStorage.setItem('todoData', JSON.stringify(groups));
}

// تابع برای بارگذاری داده‌ها از localStorage
function loadData() {
    const savedData = localStorage.getItem('todoData');
    if (savedData) {
        const groups = JSON.parse(savedData);
        groups.forEach(group => {
            addGroup(group.name, group.items);
        });
    }
}

// تابع برای افزودن گروه جدید
function addGroup(groupName, items = []) {
    if (!groupName) {
        groupName = document.getElementById('groupName').value.trim();
    }
    if (groupName) {
        const groups = document.getElementById('groups');

        // ایجاد گروه جدید
        const groupDiv = document.createElement('div');
        groupDiv.className = 'group';

        // عنوان گروه و دکمه حذف گروه
        const groupHeader = document.createElement('h3');
        groupHeader.innerHTML = `
            ${groupName}
            <button onclick="deleteGroup(this)">حذف گروه</button>
        `;
        groupDiv.appendChild(groupHeader);

        // لیست آیتم‌ها
        const itemList = document.createElement('ul');
        items.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${item}
                <button onclick="deleteItem(this)">حذف</button>
            `;
            itemList.appendChild(li);
        });
        groupDiv.appendChild(itemList);

        // فرم افزودن آیتم جدید
        const addItemForm = document.createElement('div');
        addItemForm.className = 'add-item';
        addItemForm.innerHTML = `
            <input type="text" placeholder="افزودن آیتم جدید">
            <button onclick="addItem(this)">افزودن</button>
        `;
        groupDiv.appendChild(addItemForm);

        // افزودن گروه به لیست گروه‌ها
        groups.appendChild(groupDiv);

        // پاک کردن فیلد ورودی
        document.getElementById('groupName').value = '';

        // ذخیره داده‌ها
        saveData();
    }
}

// تابع برای افزودن آیتم جدید
function addItem(button) {
    const input = button.previousElementSibling;
    const itemText = input.value.trim();
    if (itemText) {
        const itemList = button.parentElement.previousElementSibling;
        const li = document.createElement('li');
        li.innerHTML = `
            ${itemText}
            <button onclick="deleteItem(this)">حذف</button>
        `;
        itemList.appendChild(li);

        // پاک کردن فیلد ورودی
        input.value = '';

        // ذخیره داده‌ها
        saveData();
    }
}

// تابع برای حذف گروه
function deleteGroup(button) {
    const groupDiv = button.closest('.group');
    groupDiv.remove();

    // ذخیره داده‌ها
    saveData();
}

// تابع برای حذف آیتم
function deleteItem(button) {
    const li = button.closest('li');
    li.remove();

    // ذخیره داده‌ها
    saveData();
}

// تغییر حالت روشن/تاریک
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.getElementById('themeToggle').textContent = isDarkMode ? 'حالت روشن' : 'حالت تاریک';
}

// بارگذاری حالت ذخیره‌شده
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('themeToggle').textContent = 'حالت روشن';
    }
}

// بارگذاری داده‌ها هنگام لود صفحه
window.onload = () => {
    loadTheme();
    loadData();
};

// افزودن رویداد کلیک به دکمه تغییر حالت
document.getElementById('themeToggle').addEventListener('click', toggleTheme);
