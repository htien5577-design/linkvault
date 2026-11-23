// State management
let links = [];
let folders = ['Chung', 'Khoa học', 'Âm thanh', 'Dữ liệu']; // Default folders
const STORAGE_KEY = 'linkvault_data_v2';
const FOLDER_KEY = 'linkvault_folders_v2';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderFolderOptions();
    renderLinks();
});

function loadData() {
    const storedLinks = localStorage.getItem(STORAGE_KEY);
    const storedFolders = localStorage.getItem(FOLDER_KEY);

    if (storedLinks) links = JSON.parse(storedLinks);
    if (storedFolders) folders = JSON.parse(storedFolders);

    // Fallback sample data if completely empty
    if (links.length === 0) {
        links = [
            { id: crypto.randomUUID(), url: 'https://voca.ro/1m5myCmTSx3o', title: 'Bài hát Voca.ro mẫu', category: 'Âm thanh', tags: ['voca', 'audio'], notes: 'Link âm thanh chất lượng cao.', createdAt: new Date().toISOString() },
            { id: crypto.randomUUID(), url: 'https://arxiv.org/abs/2310.00001', title: 'Nghiên cứu mới về Machine Learning', category: 'Khoa học', tags: ['arxiv', 'AI'], notes: 'Bài báo khoa học quan trọng.', createdAt: new Date().toISOString() }
        ];
        saveData();
    }
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
    localStorage.setItem(FOLDER_KEY, JSON.stringify(folders));
}

// ================= FOLDER MANAGEMENT =================
function openFolderModal() {
    renderFolderList();
    document.getElementById('folderModal').classList.remove('hidden');
}

function closeFolderModal() {
    document.getElementById('folderModal').classList.add('hidden');
}

function renderFolderList() {
    const list = document.getElementById('folderList');
    list.innerHTML = '';
    folders.forEach(folder => {
        const isDefault = folder === 'Chung';
        const div = document.createElement('div');
        div.className = 'flex items-center justify-between bg-dark-900 p-3 rounded-sm border border-dark-700 group hover:border-accent/50 transition-colors';
        div.innerHTML = `
            <div class="flex items-center gap-3">
                <i class="fa-solid fa-folder text-accent/70"></i>
                <span class="text-sm font-medium text-slate-200">${folder}</span>
            </div>
            ${!isDefault ? `
            <button onclick="deleteFolder('${folder}')" class="text-slate-600 hover:text-red-500 transition-colors p-1" title="Xóa thư mục">
                <i class="fa-solid fa-trash-can text-sm"></i>
            </button>` : '<span class="text-[10px] text-slate-600 uppercase font-bold tracking-wider">Mặc định</span>'}
        `;
        list.appendChild(div);
    });
}

function addFolder(e) {
    e.preventDefault();
    const input = document.getElementById('newFolderName');
    const name = input.value.trim();

    if (name && !folders.includes(name)) {
        folders.push(name);
        saveData();
        renderFolderList();
        renderFolderOptions(); // Update dropdown in link form
        input.value = '';
    } else if (folders.includes(name)) {
        alert('Thư mục này đã tồn tại!');
    }
}

function deleteFolder(folderName) {
    if (confirm(`Xóa thư mục "${folderName}"? Các link trong thư mục này sẽ được chuyển về "Chung".`)) {
        // Move links to 'Chung'
        links.forEach(link => {
            if (link.category === folderName) link.category = 'Chung';
        });
        // Remove folder
        folders = folders.filter(f => f !== folderName);
        saveData();
        renderFolderList();
        renderFolderOptions();
        renderLinks(); // Re-render to show updated categories
    }
}

function renderFolderOptions() {
    // Update Filter Dropdown
    const filterSelect = document.getElementById('categoryFilter');
    const currentFilter = filterSelect.value;
    filterSelect.innerHTML = '<option value="all">Tất cả thư mục</option>';
    folders.forEach(f => {
        filterSelect.innerHTML += `<option value="${f}">${f}</option>`;
    });
    filterSelect.value = currentFilter;

    // Update Form Dropdown
    const formSelect = document.getElementById('category');
    formSelect.innerHTML = '';
    folders.forEach(f => {
        formSelect.innerHTML += `<option value="${f}">${f}</option>`;
    });
}

// ================= LINK MANAGEMENT =================
function openLinkModal(isEdit = false) {
    document.getElementById('linkModal').classList.remove('hidden');
    if (!isEdit) {
        document.getElementById('linkForm').reset();
        document.getElementById('linkId').value = '';
        document.getElementById('linkModalTitle').textContent = 'Thêm Liên Kết Mới';
        // Default to first folder or 'Chung'
        document.getElementById('category').value = folders.includes('Chung') ? 'Chung' : folders[0];
    }
}

function closeLinkModal() {
    document.getElementById('linkModal').classList.add('hidden');
}

function saveLink(e) {
    e.preventDefault();
    const id = document.getElementById('linkId').value;
    const url = document.getElementById('url').value.trim();
    const title = document.getElementById('title').value.trim();
    const category = document.getElementById('category').value;
    const tagsStr = document.getElementById('tags').value.trim();
    const notes = document.getElementById('notes').value.trim();
    const tags = tagsStr ? tagsStr.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : [];

    if (id) {
        const index = links.findIndex(l => l.id === id);
        if (index !== -1) links[index] = { ...links[index], url, title, category, tags, notes };
    } else {
        links.unshift({ id: crypto.randomUUID(), url, title, category, tags, notes, createdAt: new Date().toISOString() });
    }

    saveData();
    renderLinks();
    closeLinkModal();
}

function editLink(id) {
    const link = links.find(l => l.id === id);
    if (!link) return;
    document.getElementById('linkId').value = link.id;
    document.getElementById('url').value = link.url;
    document.getElementById('title').value = link.title;
    document.getElementById('category').value = link.category;
    document.getElementById('tags').value = link.tags.join(', ');
    document.getElementById('notes').value = link.notes || '';
    document.getElementById('linkModalTitle').textContent = 'Chỉnh Sửa Liên Kết';
    openLinkModal(true);
}

function deleteLink(id) {
    if (confirm('Bạn có chắc chắn muốn xóa liên kết này không?')) {
        links = links.filter(l => l.id !== id);
        saveData();
        renderLinks();
    }
}

function renderLinks() {
    const grid = document.getElementById('linksGrid');
    const emptyState = document.getElementById('emptyState');
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;

    const filtered = links.filter(link => {
        const matchesSearch = link.title.toLowerCase().includes(searchQuery) || 
                            link.tags.some(t => t.toLowerCase().includes(searchQuery)) ||
                            (link.notes && link.notes.toLowerCase().includes(searchQuery));
        const matchesCategory = categoryFilter === 'all' || link.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    document.getElementById('totalCount').textContent = `${filtered.length} liên kết`;
    grid.innerHTML = '';

    if (filtered.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        filtered.forEach(link => {
            const card = document.createElement('div');
            card.className = 'bg-dark-800 border border-dark-700 rounded-sm p-5 card-hover transition-all duration-300 flex flex-col h-full';

            const tagsHtml = link.tags.map(tag => 
                `<span class="inline-block bg-dark-900 text-accent text-[10px] font-bold px-2 py-1 rounded-sm border border-dark-700 uppercase tracking-wider mr-1 mb-1">#${tag}</span>`
            ).join('');

            let icon = 'fa-link';
            if (link.url.includes('arxiv')) icon = 'fa-file-pdf';
            else if (link.url.includes('zenodo')) icon = 'fa-database';
            else if (link.url.includes('voca') || link.category.toLowerCase().includes('âm')) icon = 'fa-music';
            else if (link.category.toLowerCase().includes('video')) icon = 'fa-video';

            card.innerHTML = `
                <div class="flex justify-between items-start mb-3">
                    <div class="flex items-center gap-2 text-accent mb-1">
                        <i class="fa-solid ${icon}"></i>
                        <span class="text-xs font-bold uppercase tracking-widest text-slate-400">${link.category}</span>
                    </div>
                    <div class="flex gap-3">
                        <button onclick="editLink('${link.id}')" class="text-slate-500 hover:text-accent transition-colors" title="Chỉnh sửa"><i class="fa-solid fa-pen text-xs"></i></button>
                        <button onclick="deleteLink('${link.id}')" class="text-slate-500 hover:text-red-500 transition-colors" title="Xóa"><i class="fa-solid fa-trash text-xs"></i></button>
                    </div>
                </div>
                <h3 class="text-lg font-bold text-white mb-2 leading-tight line-clamp-2" title="${link.title}">${link.title}</h3>
                ${link.notes ? `<p class="text-slate-400 text-sm mb-4 line-clamp-3 flex-1 italic border-l-2 border-dark-700 pl-3">${link.notes}</p>` : '<div class="flex-1"></div>'}
                <div class="mb-4 flex flex-wrap">${tagsHtml}</div>
                <a href="${link.url}" target="_blank" rel="noopener noreferrer" 
                   class="mt-auto w-full bg-dark-900 hover:bg-accent hover:text-dark-900 text-accent border border-accent/30 text-center font-bold text-sm py-2.5 rounded-sm transition-all duration-200 flex items-center justify-center gap-2 group">
                    <span>Truy cập liên kết</span>
                    <i class="fa-solid fa-arrow-up-right-from-square text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"></i>
                </a>
            `;
            grid.appendChild(card);
        });
    }
}

// ================= IMPORT / EXPORT =================
function exportData() {
    const exportObj = {
        version: "2.0",
        exportDate: new Date().toISOString(),
        folders: folders,
        links: links
    };
    const dataStr = JSON.stringify(exportObj, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linkvault_backup_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importData(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);

            // Handle both old format (array) and new format (object)
            if (Array.isArray(data)) {
                links = data; // Old format fallback
            } else if (data.links && Array.isArray(data.links)) {
                links = data.links;
                if (data.folders && Array.isArray(data.folders)) {
                    folders = data.folders;
                }
            } else {
                throw new Error("Định dạng file không hợp lệ");
            }

            saveData();
            renderFolderOptions();
            renderLinks();
            alert(`Nhập thành công! Đã khôi phục ${links.length} liên kết và ${folders.length} thư mục.`);
        } catch (err) {
            alert('Lỗi khi đọc file JSON. Vui lòng kiểm tra lại file.');
            console.error(err);
        }
        input.value = ''; // Reset
    };
    reader.readAsText(file);
}

// Close modals on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeFolderModal();
        closeLinkModal();
    }
});
