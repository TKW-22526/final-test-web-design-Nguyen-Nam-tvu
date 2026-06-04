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
    
    // Kiểm tra xem file hiện tại có ở trong thư mục con không
    if (window.location.pathname.toLowerCase().includes('/html/')) {
        basePath = '../assets/';
    }
    
    // Nếu là GitHub Pages, chuyển sang đường dẫn tuyệt đối
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
    // Đường dẫn tùy thuộc vào việc đang đứng ở file nào
    const detailPage = isAdmin ? "html/chi-tiet.html" : "chi-tiet.html";
    link.setAttribute("href", detailPage + "?id=" + item.id);
    link.setAttribute("class", "btn btn-info btn-sm me-1");

    cardDiv.appendChild(img);
    cardDiv.appendChild(name);
    cardDiv.appendChild(price);
    cardDiv.appendChild(link);

    // Nếu là trang quản lý thì mới thêm nút Sửa/Xóa
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

    if (id) { // Sửa
        const item = productList.find(p => p.id === id);
        if (item) {
            item.name = name;
            item.price = price;
            item.image = image;
        }
    } else { // Thêm mới
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