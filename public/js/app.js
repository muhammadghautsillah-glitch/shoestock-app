// Konfirmasi sebelum mengirim form yang punya atribut data-konfirmasi
document.addEventListener('submit', function (e) {
  var pesan = e.target.getAttribute('data-konfirmasi');
  if (pesan && !window.confirm(pesan)) {
    e.preventDefault();
  }
});

// Pencarian sederhana pada tabel
(function () {
  var input = document.getElementById('cari');
  var tabel = document.querySelector('table[data-cari]');
  if (!input || !tabel) return;

  input.addEventListener('input', function () {
    var kata = input.value.toLowerCase().trim();
    var baris = tabel.querySelectorAll('tbody tr');
    for (var i = 0; i < baris.length; i++) {
      var cocok = baris[i].textContent.toLowerCase().indexOf(kata) !== -1;
      baris[i].style.display = cocok ? '' : 'none';
    }
  });
})();
// Konfirmasi sebelum mengirim form yang punya atribut data-konfirmasi
document.addEventListener('submit', function (e) {
  var pesan = e.target.getAttribute('data-konfirmasi');
  if (pesan && !window.confirm(pesan)) {
    e.preventDefault();
  }
});

// Pencarian sederhana pada tabel
(function () {
  var input = document.getElementById('cari');
  var tabel = document.querySelector('table[data-cari]');
  if (!input || !tabel) return;

  input.addEventListener('input', function () {
    var kata = input.value.toLowerCase().trim();
    var baris = tabel.querySelectorAll('tbody tr');
    for (var i = 0; i < baris.length; i++) {
      var cocok = baris[i].textContent.toLowerCase().indexOf(kata) !== -1;
      baris[i].style.display = cocok ? '' : 'none';
    }
  });
})();