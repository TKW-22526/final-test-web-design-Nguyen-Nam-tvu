const productList = [
    {
        id: "01",
        name: "Laptop Dell XPS 15",
        price: 35000000,
        image: "laptopdell.jpg",
        desc: "Laptop cao cấp, màn hình 4K sắc nét."
    },
    {
        id: "02",
        name: "iPhone 15 Pro",
        price: 28000000,
        image: "ip15prm.jpg",
        desc: "Điện thoại khung titan siêu nhẹ, chip A17 Pro."
    },
    {
        id: "03",
        name: "Tai nghe Sony XM5",
        price: 7500000,
        image: "sonywh.jpg",
        desc: "Tai nghe chống ồn chủ động tốt nhất hiện nay."
    }
];


function resolveImagePath(image) {
    if (!image) return "";
    const normalized = image.trim();
    if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
        return normalized;
    }
    
    let basePath = './assets/';
    
    if (window.location.pathname.toLowerCase().includes('/html/')) {
        basePath = '../assets/';
    }
    
    if (window.location.hostname.includes('github.io')) {
        const pathParts = window.location.pathname.split('/').filter(p => p);
        if (pathParts.length > 0) {
            basePath = '/' + pathParts[0] + '/assets/';
        } else {
            basePath = '/assets/';
        }
    }
    
    return basePath + normalized;
}

// Hàm để resolve đường dẫn link (chi tiết sản phẩm, v.v.)
function resolveLinkPath(pageName) {
    if (pageName.startsWith('/')) {
        return pageName;
    }
    
    if (pageName.startsWith('http') || pageName.startsWith('//') || pageName.startsWith('#')) {
        return pageName;
    }
    
    if (window.location.hostname.includes('github.io')) {
        const pathParts = window.location.pathname.split('/').filter(p => p);
        let repoName = pathParts.length > 0 ? pathParts[0] : '';
        
        let normalized = pageName;
        let goUpLevels = 0;
        
        while (normalized.startsWith('../')) {
            goUpLevels++;
            normalized = normalized.substring(3);
        }
        
        const currentPath = window.location.pathname;
        const isInHtmlFolder = currentPath.includes('/html/');
        
        let basePath = repoName ? '/' + repoName + '/' : '/';
        
        if (goUpLevels === 0 && isInHtmlFolder && !normalized.includes('/')) {
            basePath += 'html/';
        }
        
        if (goUpLevels > 0) {
            if (isInHtmlFolder) {
                if (goUpLevels >= 1) {
                    basePath += '';
                }
            }
        }
        
        return basePath + normalized;
    }
    
    return pageName;
}

// Hàm render cho trang Quản Lý (index.html)
function renderAdminGrid(list) {
    const container = document.getElementById("product-list");
    if (!container) return;
    container.innerHTML = "";
    
    list.forEach(item => {
        const productItem = createProductCard(item, true);
        container.appendChild(productItem);
    });
}

// Hàm render cho trang Sản Phẩm (sanpham.html)
function renderUserGrid(list) {
    const container = document.getElementById("product-list-user");
    if (!container) return;
    container.innerHTML = "";
    
    list.forEach(item => {
        const productItem = createProductCard(item, false);
        container.appendChild(productItem);
    });
}

// Hàm dùng chung để tạo thẻ HTML
function createProductCard(item, isAdmin) {
    const productItem = document.createElement("div");
    productItem.setAttribute("class", "col-md-4 mb-4");

    const cardDiv = document.createElement("div");
    cardDiv.setAttribute("class", "product-card h-100 p-3 bg-white rounded shadow-sm text-center");

    const img = document.createElement("img");
    img.setAttribute("src", resolveImagePath(item.image));
    img.setAttribute("class", "img-fluid mb-3");
    img.setAttribute("style", "height: 150px; object-fit: contain;");

    const name = document.createElement("h5");
    name.innerText = item.name;

    const price = document.createElement("p");
    price.setAttribute("class", "text-danger fw-bold");
    price.innerText = Number(item.price).toLocaleString() + " đ";

    const link = document.createElement("a");
    link.innerText = "Chi tiết";
    const detailPage = isAdmin ? "html/chi-tiet.html" : "chi-tiet.html";
    const detailLink = resolveLinkPath(detailPage);
    link.setAttribute("href", detailLink + "?id=" + item.id);
    link.setAttribute("class", "btn btn-info btn-sm me-1");

    cardDiv.appendChild(img);
    cardDiv.appendChild(name);
    cardDiv.appendChild(price);
    cardDiv.appendChild(link);

    if (isAdmin) {
        const editBtn = document.createElement("button");
        editBtn.innerText = "Sửa";
        editBtn.setAttribute("class", "btn btn-warning btn-sm me-1");
        editBtn.setAttribute("onclick", `prepareEdit("${item.id}")`);

        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Xóa";
        deleteBtn.setAttribute("class", "btn btn-danger btn-sm");
        deleteBtn.setAttribute("onclick", `deleteProduct("${item.id}")`);

        cardDiv.appendChild(editBtn);
        cardDiv.appendChild(deleteBtn);
    }

    productItem.appendChild(cardDiv);
    return productItem;
}

// Các hàm xử lý CRUD Tìm kiếm, Thêm, Sửa, Xóa cho trang Admin
function searchProduct() {
    const keyword = document.getElementById("search-input").value.toLowerCase().trim();
    const filteredList = productList.filter(item => item.name.toLowerCase().includes(keyword));
    renderAdminGrid(filteredList);
}

function deleteProduct(id) {
    if (confirm("Xóa sản phẩm này?")) {
        const index = productList.findIndex(item => item.id === id);
        if (index !== -1) productList.splice(index, 1);
        searchProduct();
    }
}

function prepareEdit(id) {
    const item = productList.find(p => p.id === id);
    if (item) {
        document.getElementById("form-id").value = item.id;
        document.getElementById("form-name").value = item.name;
        document.getElementById("form-price").value = item.price;
        document.getElementById("form-image").value = item.image;
        document.getElementById("btn-save").innerText = "Cập nhật";
    }
}

function saveProduct() {
    const id = document.getElementById("form-id").value;
    const name = document.getElementById("form-name").value;
    const price = document.getElementById("form-price").value;
    const image = document.getElementById("form-image").value;

    if (!name || !price) return alert("Nhập đủ tên và giá!");

    if (id) {
        const item = productList.find(p => p.id === id);
        if (item) {
            item.name = name;
            item.price = price;
            item.image = image;
        }
    } else {
        productList.push({
            id: Date.now().toString(),
            name: name,
            price: price,
            image: image,
            desc: "Thông tin đang cập nhật..."
        });
    }
    resetForm();
    searchProduct();
}

function resetForm() {
    document.getElementById("form-id").value = "";
    document.getElementById("form-name").value = "";
    document.getElementById("form-price").value = "";
    document.getElementById("form-image").value = "";
    document.getElementById("btn-save").innerText = "Thêm";
}

// Xử lý hiển thị trang Chi Tiết Sản Phẩm
function renderDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const item = productList.find(p => p.id === id);
    
    if (item) {
        document.getElementById("detail-img").src = resolveImagePath(item.image);
        document.getElementById("detail-name").innerText = item.name;
        document.getElementById("detail-price").innerText = Number(item.price).toLocaleString() + " đ";
        document.getElementById("detail-desc").innerText = item.desc;
    } else {
        document.getElementById("detail-name").innerText = "Không tìm thấy sản phẩm!";
    }
}

// Hàm auto-fix tất cả các đường dẫn khi trang load
function fixAllPaths() {
    if (!window.location.hostname.includes('github.io')) {
        return;
    }
    
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href.startsWith('http') && !href.startsWith('#') && !href.startsWith('javascript:')) {
            const fixed = resolveLinkPath(href.split('?')[0]);
            const query = href.includes('?') ? '?' + href.split('?')[1] : '';
            link.setAttribute('href', fixed + query);
        }
    });
    
    document.querySelectorAll('script[src]').forEach(script => {
        const src = script.getAttribute('src');
        if (!src.startsWith('http') && !src.startsWith('//')) {
            script.setAttribute('src', resolveLinkPath(src));
        }
    });
    
    document.querySelectorAll('link[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href.startsWith('http') && !href.startsWith('//')) {
            link.setAttribute('href', resolveLinkPath(href));
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixAllPaths);
} else {
    fixAllPaths();
}