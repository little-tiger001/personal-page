const STORAGE_KEY_BOOKMARKS = 'bookmarks_v2';
const STORAGE_KEY_TODOS = 'todos_v1';

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    updateClock();
    setInterval(updateClock, 1000);
    loadTodos();
    loadCategories();
    setupSearch();
    setupModals();
    setupDragDrop();
    setupTodoToggle();
    setupBookmarkToggle();
    setupThemeToggle();
});

// ========== 主题 ==========
const THEME_KEY = 'theme_v1';

function loadTheme() {
    const theme = localStorage.getItem(THEME_KEY);
    if (theme === 'light') {
        document.body.classList.add('light');
    } else {
        document.body.classList.remove('light');
    }
    updateThemeIcon();
}

function toggleTheme() {
    const isLight = document.body.classList.toggle('light');
    localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
    updateThemeIcon();
}

function updateThemeIcon() {
    const btn = document.getElementById('theme-btn');
    if (!btn) return;
    const isLight = document.body.classList.contains('light');
    btn.innerHTML = isLight
        ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
}

function setupThemeToggle() {
    const btn = document.getElementById('theme-btn');
    if (btn) btn.addEventListener('click', toggleTheme);
}

// ========== 时钟 ==========
function updateClock() {
    const now = new Date();
    const timeEl = document.getElementById('clock');
    const dateEl = document.getElementById('date');

    if (timeEl) {
        timeEl.textContent = now.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }
    if (dateEl) {
        dateEl.textContent = now.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
    }
}

// ========== 搜索 ==========
function setupSearch() {
    const form = document.getElementById('search-form');
    if (!form) return;
    form.addEventListener('submit', e => {
        e.preventDefault();
        const query = document.getElementById('search-input').value.trim();
        if (query) {
            window.open(`https://www.bing.com/search?q=${encodeURIComponent(query)}`, '_blank');
        }
    });
}

// ========== 分类数据 ==========
function getCategories() {
    const data = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
    if (!data) return [];
    try {
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function saveCategories(categories) {
    localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(categories));
}

// ========== 加载分类 ==========
function loadCategories() {
    const container = document.getElementById('categories-container');
    if (!container) return;

    const categories = getCategories();

    if (categories.length === 0) {
        container.innerHTML = `
            <button class="category-add-btn" onclick="openCategoryModal()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 5v14M5 12h14"/>
                </svg>
                添加分类
            </button>
        `;
        return;
    }

    container.innerHTML = categories.map((cat, catIndex) => `
        <div class="category" data-index="${catIndex}">
            <div class="category-header" onclick="toggleCategory(${catIndex})">
                <div class="category-title">
                    <span class="category-icon">${cat.icon || '📁'}</span>
                    <span>${cat.name}</span>
                    <span class="category-count">${cat.bookmarks?.length || 0}</span>
                </div>
                <div class="category-actions" onclick="event.stopPropagation()">
                    <button onclick="openBookmarkModal(null, ${catIndex})" title="添加网站">+</button>
                    <button onclick="editCategory(${catIndex})" title="编辑">✎</button>
                    <button onclick="deleteCategory(${catIndex})" title="删除">×</button>
                </div>
            </div>
            <div class="category-books" id="books-${catIndex}">
                <div class="bookmarks-grid">
                    ${(cat.bookmarks || []).map((bm, bmIndex) => `
                        <a href="${bm.url}" target="_blank" class="bookmark-card">
                            <div class="bookmark-card__icon">${getFaviconHtml(bm.icon, bm.name)}</div>
                            <span class="bookmark-card__name">${bm.name}</span>
                            <div class="bookmark-card__actions" onclick="event.preventDefault(); event.stopPropagation();">
                                <button onclick="editBookmark(${catIndex}, ${bmIndex})" class="btn-edit">✎</button>
                                <button onclick="deleteBookmark(${catIndex}, ${bmIndex})" class="btn-delete">×</button>
                            </div>
                        </a>
                    `).join('')}
                    <button class="bookmark-card" onclick="openBookmarkModal(null, ${catIndex})" style="cursor:pointer; background: transparent; border: 1px dashed var(--border);">
                        <div class="bookmark-card__icon" style="background: transparent; color: var(--text-secondary);">+</div>
                        <span class="bookmark-card__name" style="color: var(--text-secondary);">添加网站</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function getFaviconHtml(iconUrl, name) {
    if (iconUrl) {
        return `<img src="${iconUrl}" alt="" onerror="this.parentElement.innerHTML='${name[0]}'">`;
    }
    return name[0];
}

function toggleCategory(index) {
    const el = document.getElementById(`books-${index}`);
    if (el) {
        el.classList.toggle('expanded');
    }
}

// ========== 待办事项 ==========
function getTodos() {
    const data = localStorage.getItem(STORAGE_KEY_TODOS);
    return data ? JSON.parse(data) : [];
}

function saveTodos(todos) {
    localStorage.setItem(STORAGE_KEY_TODOS, JSON.stringify(todos));
}

function loadTodos() {
    const list = document.getElementById('todo-list');
    if (!list) return;

    const todos = getTodos();

    if (todos.length === 0) {
        list.innerHTML = '<li class="todo-empty">暂无待办事项</li>';
        return;
    }

    list.innerHTML = todos.map((todo, index) => `
        <li class="todo-item ${todo.done ? 'done' : ''}" data-index="${index}">
            <div class="todo-checkbox ${todo.done ? 'checked' : ''}" onclick="toggleTodo(${index})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
            </div>
            <span class="todo-item__text">${todo.text}</span>
            <button class="todo-item__delete" onclick="deleteTodo(${index})">×</button>
        </li>
    `).join('');
}

function toggleTodo(index) {
    const todos = getTodos();
    todos[index].done = !todos[index].done;
    saveTodos(todos);
    loadTodos();
}

function deleteTodo(index) {
    const todos = getTodos();
    todos.splice(index, 1);
    saveTodos(todos);
    loadTodos();
}

function addTodo(text) {
    if (!text.trim()) return;
    const todos = getTodos();
    todos.push({ text: text.trim(), done: false });
    saveTodos(todos);
    loadTodos();
}

// ========== 弹窗 ==========
function setupModals() {
    // 待办表单
    const todoForm = document.getElementById('todo-form');
    if (todoForm) {
        todoForm.addEventListener('submit', e => {
            e.preventDefault();
            const input = document.getElementById('todo-input');
            if (input) {
                addTodo(input.value);
                input.value = '';
            }
        });
    }

    // 分类弹窗
    setupModal('category-modal', 'category-form', 'category-name', null, null,
        () => {
            const name = document.getElementById('category-name').value.trim();
            const icon = document.getElementById('category-icon').value.trim();
            const editIndex = document.getElementById('edit-category-index').value;
            if (!name) return;

            const categories = getCategories();
            const cat = { name, icon: icon || '📁', bookmarks: [] };

            if (editIndex === '') {
                categories.push(cat);
            } else {
                categories[parseInt(editIndex)].name = name;
                categories[parseInt(editIndex)].icon = cat.icon;
            }
            saveCategories(categories);
            loadCategories();
        }
    );

    // 书签弹窗
    setupModal('bookmark-modal', 'bookmark-form', null, null, null,
        () => {
            const name = document.getElementById('site-name').value.trim();
            const url = document.getElementById('site-url').value.trim();
            const icon = document.getElementById('site-icon').value.trim();
            const catIndex = document.getElementById('edit-bookmark-category').value;
            const editBmIndex = document.getElementById('edit-bookmark-index').value;

            if (!name || !url || catIndex === '') return;

            const categories = getCategories();
            const bookmark = { name, url, icon };

            if (editBmIndex === '') {
                if (!categories[parseInt(catIndex)].bookmarks) {
                    categories[parseInt(catIndex)].bookmarks = [];
                }
                categories[parseInt(catIndex)].bookmarks.push(bookmark);
            } else {
                categories[parseInt(catIndex)].bookmarks[parseInt(editBmIndex)] = bookmark;
            }
            saveCategories(categories);
            loadCategories();
        },
        () => {
            updateCategorySelect();
        }
    );

    // 关闭按钮
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.remove('active');
        });
    });

    // 点击遮罩关闭
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', e => {
            if (e.target === modal) modal.classList.remove('active');
        });
    });

    // 添加分类按钮
    const addCatBtn = document.getElementById('add-category-btn');
    if (addCatBtn) {
        addCatBtn.addEventListener('click', () => openCategoryModal());
    }
}

function setupModal(modalId, formId, nameId, urlId, iconId, onSubmit, onOpen) {
    const modal = document.getElementById(modalId);
    const form = document.getElementById(formId);
    if (!modal || !form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        onSubmit();
        modal.classList.remove('active');
    });
}

function openCategoryModal(catIndex) {
    const modal = document.getElementById('category-modal');
    const title = document.getElementById('category-modal-title');
    const form = document.getElementById('category-form');
    const nameInput = document.getElementById('category-name');
    const iconInput = document.getElementById('category-icon');
    const editIndex = document.getElementById('edit-category-index');

    form.reset();
    editIndex.value = '';

    if (catIndex !== null && catIndex !== undefined) {
        const categories = getCategories();
        title.textContent = '编辑分类';
        nameInput.value = categories[catIndex].name;
        iconInput.value = categories[catIndex].icon || '';
        editIndex.value = catIndex;
    } else {
        title.textContent = '添加分类';
    }

    modal.classList.add('active');
}

function openBookmarkModal(bmIndex, catIndex) {
    const modal = document.getElementById('bookmark-modal');
    const title = document.getElementById('bookmark-modal-title');
    const form = document.getElementById('bookmark-form');

    document.getElementById('site-name').value = '';
    document.getElementById('site-url').value = '';
    document.getElementById('site-icon').value = '';
    document.getElementById('edit-bookmark-index').value = '';
    document.getElementById('edit-bookmark-category').value = catIndex;

    updateCategorySelect(catIndex);

    if (bmIndex !== null && bmIndex !== undefined) {
        const categories = getCategories();
        const bm = categories[catIndex].bookmarks[bmIndex];
        title.textContent = '编辑网站';
        document.getElementById('site-name').value = bm.name;
        document.getElementById('site-url').value = bm.url;
        document.getElementById('site-icon').value = bm.icon || '';
        document.getElementById('edit-bookmark-index').value = bmIndex;
        document.getElementById('edit-bookmark-category').value = catIndex;
    } else {
        title.textContent = '添加网站';
    }

    modal.classList.add('active');
}

function updateCategorySelect(selectedIndex) {
    const select = document.getElementById('site-category');
    const categories = getCategories();
    select.innerHTML = categories.map((cat, i) =>
        `<option value="${i}" ${i == selectedIndex ? 'selected' : ''}>${cat.name}</option>`
    ).join('');
}

function editCategory(index) {
    openCategoryModal(index);
}

function deleteCategory(index) {
    if (!confirm('确定要删除这个分类吗？')) return;
    const categories = getCategories();
    categories.splice(index, 1);
    saveCategories(categories);
    loadCategories();
}

function editBookmark(catIndex, bmIndex) {
    openBookmarkModal(bmIndex, catIndex);
}

function deleteBookmark(catIndex, bmIndex) {
    if (!confirm('确定要删除这个网站吗？')) return;
    const categories = getCategories();
    categories[catIndex].bookmarks.splice(bmIndex, 1);
    saveCategories(categories);
    loadCategories();
}

// ========== 拖拽 ==========
function setupDragDrop() {
    const zone = document.getElementById('drop-zone');
    const inner = document.getElementById('drop-zone-inner');
    if (!zone || !inner) return;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
        zone.addEventListener(event, e => { e.preventDefault(); e.stopPropagation(); });
    });

    ['dragenter', 'dragover'].forEach(event => {
        zone.addEventListener(event, () => {
            zone.classList.add('drag-over');
            inner.classList.add('drag-over');
        });
    });

    ['dragleave', 'drop'].forEach(event => {
        zone.addEventListener(event, () => {
            zone.classList.remove('drag-over');
            inner.classList.remove('drag-over');
        });
    });

    zone.addEventListener('drop', e => {
        const text = e.dataTransfer.getData('text/plain');
        if (!text) return;

        let url = text.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        try {
            const parsed = new URL(url);
            const name = parsed.hostname.replace('www.', '').split('.')[0];
            const capName = name.charAt(0).toUpperCase() + name.slice(1);

            // 默认添加到第一个分类，或弹出选择
            const categories = getCategories();
            if (categories.length === 0) {
                // 自动创建默认分类
                categories.push({ name: '默认', icon: '📁', bookmarks: [] });
                saveCategories(categories);
            }

            const targetCat = categories[0];
            // 检查重复
            if (!targetCat.bookmarks.some(b => b.url === url)) {
                targetCat.bookmarks.push({ name: capName, url, icon: '' });
                saveCategories(categories);
                loadCategories();
            }
        } catch (e) {
            // 无效 URL
        }
    });
}

// ========== 折叠 ==========
function setupTodoToggle() {
    const btn = document.getElementById('todo-toggle');
    const content = document.getElementById('todo-content');
    if (!btn || !content) return;

    btn.addEventListener('click', () => {
        content.classList.toggle('collapsed');
        btn.textContent = content.classList.contains('collapsed') ? '+' : '−';
    });
}

function setupBookmarkToggle() {
    const btn = document.getElementById('bookmarks-toggle');
    const dropZone = document.getElementById('drop-zone');
    const categories = document.getElementById('categories-container');
    if (!btn) return;

    btn.addEventListener('click', () => {
        dropZone?.classList.toggle('hidden');
        categories?.classList.toggle('hidden');
        btn.textContent = dropZone?.classList.contains('hidden') ? '+' : '−';
    });
}