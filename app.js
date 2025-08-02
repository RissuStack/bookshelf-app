let editingBookId = null; // null = tidak dalam mode edit
let books = [];
const STORAGE_KEY = "BOOKSHELF-DATA";

document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) books = JSON.parse(saved);
  renderBooks(books);

  // Tutup modal
  document.getElementById("close-modal").addEventListener("click", () => {
    document.getElementById("modal-edit").classList.add("hidden");
    editingBookId = null;
  });

  // Submit modal edit
  document.getElementById("edit-form").addEventListener("submit", function (e) {
    e.preventDefault();
    if (editingBookId === null) return;

    const updated = {
      id: editingBookId,
      judul: document.getElementById("edit-judul").value.trim(),
      penulis: document.getElementById("edit-penulis").value.trim(),
      tahun: document.getElementById("edit-tahun").value.trim(),
      selesai: document.getElementById("edit-selesai").checked,
    };

    const index = books.findIndex((b) => b.id === editingBookId);
    if (index !== -1) {
      books[index] = updated;
    }

    editingBookId = null;
    document.getElementById("modal-edit").classList.add("hidden");
    saveAndRender();
  });

  document.getElementById("form-buku").addEventListener("submit", function (e) {
    e.preventDefault();

    const judul = document.getElementById("judul").value.trim();
    const penulis = document.getElementById("penulis").value.trim();
    const tahun = document.getElementById("tahun").value.trim();
    const selesai = document.getElementById("Selesai").checked;

    if (!judul || !penulis || !tahun) return alert("Form jangan kosong!");

    if (editingBookId) {
      // Edit mode
      const bookIndex = books.findIndex((b) => b.id === editingBookId);
      if (bookIndex !== -1) {
        books[bookIndex] = {
          id: editingBookId,
          judul,
          penulis,
          tahun,
          selesai,
        };
      }

      editingBookId = null;
      document.querySelector("#form-buku button[type='submit']").textContent =
        "Tambah Buku";
    } else {
      // Tambah mode
      const buku = {
        id: +new Date(),
        judul,
        penulis,
        tahun,
        selesai,
      };

      books.push(buku);
    }

    saveAndRender();
    this.reset();
  });

  document.getElementById("searchInput").addEventListener("input", function () {
    const keyword = this.value.toLowerCase();

    const filteredBooks = books.filter((b) =>
      b.judul.toLowerCase().includes(keyword)
    );

    renderBooks(filteredBooks);
  });
});

function renderBooks(listBuku) {
  const belumDibaca = document.getElementById("unread");
  const sudahDibaca = document.getElementById("read");

  belumDibaca.innerHTML = "";
  sudahDibaca.innerHTML = "";

  for (const buku of listBuku) {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${buku.judul}</strong> - ${buku.penulis} (${buku.tahun})`;

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = buku.selesai ? "Belum Selesai" : "Selesai";
    toggleBtn.onclick = () => toggleStatus(buku.id);

    const tombolEdit = document.createElement("button");
    tombolEdit.textContent = "Edit";
    tombolEdit.onclick = () => editBook(buku.id);

    const tombolHapus = document.createElement("button");
    tombolHapus.textContent = "Hapus Buku";
    tombolHapus.onclick = () => deleteBook(buku.id);

    li.appendChild(toggleBtn);
    li.appendChild(tombolEdit);
    li.appendChild(tombolHapus);

    if (buku.selesai) {
      sudahDibaca.appendChild(li);
    } else {
      belumDibaca.appendChild(li);
    }
  }
}

function saveAndRender() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  renderBooks(books);
}

function toggleStatus(id) {
  const book = books.find((b) => b.id == id);
  if (book) book.selesai = !book.selesai;
  saveAndRender();
}

function deleteBook(id) {
  books = books.filter((b) => b.id !== id);
  saveAndRender();
}

function editBook(id) {
  const book = books.find((b) => b.id === id);
  if (!book) return;

  editingBookId = id;

  // Isi modal dengan data buku
  document.getElementById("edit-judul").value = book.judul;
  document.getElementById("edit-penulis").value = book.penulis;
  document.getElementById("edit-tahun").value = book.tahun;
  document.getElementById("edit-selesai").checked = book.selesai;

  // Tampilkan modal
  document.getElementById("modal-edit").classList.remove("hidden");
}
