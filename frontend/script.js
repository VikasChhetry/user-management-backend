const API_URL = "http://localhost:8080/api/users";
let editingUserId = null;

let currentPage = 0;
let pageSize = 5;
let currentKeyword = "";

const tableBody = document.getElementById("userTable");
const pageInfo = document.getElementById("pageInfo");

// Load users
async function loadUsers() {
    const response = await fetch(
        `${API_URL}?page=${currentPage}&size=${pageSize}&keyword=${currentKeyword}`
    );
    const data = await response.json();

    tableBody.innerHTML = "";

    data.content.forEach(user => {
        const row = `
        <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <button onclick="editUser(${user.id}, '${user.name}', '${user.email}')">
                    Edit
                </button>
                <button onclick="deleteUser(${user.id})">
                    Delete
                </button>
            </td>
        </tr>
        `;

        tableBody.innerHTML += row;
    });

    pageInfo.textContent = `Page ${data.number + 1} of ${data.totalPages}`;
}

// Add user
document.getElementById("userForm").addEventListener("submit", async e => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    let url = API_URL;
    let method = "POST";

    if (editingUserId !== null) {
        url = `${API_URL}/${editingUserId}`;
        method = "PUT";
    }

    const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
    });

    if (!response.ok) {
        const err = await response.json();
        alert(err.message);
        return;
    }

    editingUserId = null;
    e.target.reset();
    loadUsers();
});

// Delete user
async function deleteUser(id) {
    if (!confirm("Delete this user?")) return;

    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadUsers();
}

// Search
document.getElementById("search").addEventListener("input", e => {
    currentKeyword = e.target.value;
    currentPage = 0;
    loadUsers();
});

//edit user
function editUser(id, name, email) {
    document.getElementById("name").value = name;
    document.getElementById("email").value = email;
    editingUserId = id;
}

//download
function downloadCSV() {
    window.location.href = `${API_URL}/download`;
}



// Pagination
document.getElementById("prev").onclick = () => {
    if (currentPage > 0) {
        currentPage--;
        loadUsers();
    }
};

document.getElementById("next").onclick = () => {
    currentPage++;
    loadUsers();
};

// Initial load
loadUsers();
