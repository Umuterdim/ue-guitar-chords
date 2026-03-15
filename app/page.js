"use client";

import { useState, useMemo } from "react";
import { songs } from "../data/songs";

const categories = [
  "stüdyo",
  "umut",
  "samiş",
  "eren",
  "türkçe rock",
  "ingilizce",
];

function formatChords(chordsText) {
  if (!chordsText) return "";

  // HTML'yi kaçır
  let safe = chordsText
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Basit akor deseni: A-G, #/b, m, 7, sus2/sus4 gibi
  const chordRegex =
    /\b([A-G](?:#|b)?(?:m|maj|min|dim|aug)?(?:7|9|11|13)?(?:sus2|sus4)?)(?=\s|$)/g;

  safe = safe.replace(
    chordRegex,
    '<span class="chord-token">$1</span>'
  );

  return safe;
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [keyFilter, setKeyFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("türkçe rock");
  const [selectedId, setSelectedId] = useState(null);

  const filteredSongs = useMemo(() => {
    return songs.filter((song) => {
      // Kategori filtresi
      const inCategory = selectedCategory
        ? song.categories?.includes(selectedCategory)
        : true;

      // Arama filtresi
      const s = search.toLowerCase();
      const matchesSearch =
        song.title.toLowerCase().includes(s) ||
        song.artist.toLowerCase().includes(s);

      // Ton filtresi
      const matchesKey = keyFilter ? song.key === keyFilter : true;

      return inCategory && matchesSearch && matchesKey;
    });
  }, [search, keyFilter, selectedCategory]);

  const selectedSong = songs.find((s) => s.id === selectedId) || null;

  return (
    <div className="page">
      <header className="header">
        <h1>UE guitar chords</h1>
        <input
          type="text"
          placeholder="Şarkı veya sanatçı ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </header>

      <main className="main">
        <section className="panel">
          <div className="panel-header">
            <h2>Kategoriler</h2>
            <select
              value={keyFilter}
              onChange={(e) => setKeyFilter(e.target.value)}
            >
              <option value="">Tüm Tonlar</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="G">G</option>
              <option value="A">A</option>
              <option value="Am">Am</option>
              <option value="Em">Em</option>
            </select>
          </div>
          <ul className="category-list">
            {categories.map((cat) => (
              <li
                key={cat}
                className={
                  "category-item" +
                  (selectedCategory === cat ? " category-item-active" : "")
                }
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedId(null);
                }}
              >
                {cat}
              </li>
            ))}
          </ul>

          <h3 className="song-list-title">Şarkılar</h3>
          <ul className="song-list">
            {filteredSongs.length === 0 && (
              <li className="song-empty">Hiç şarkı bulunamadı.</li>
            )}
            {filteredSongs.map((song) => (
              <li
                key={song.id}
                className={
                  "song-item" +
                  (selectedSong && selectedSong.id === song.id
                    ? " song-item-active"
                    : "")
                }
                onClick={() => setSelectedId(song.id)}
              >
                <div className="song-title">
                  {song.title} – {song.artist}
                </div>
                <div className="song-meta">
                  Ton: {song.key} | Capo: {song.capo} | Zorluk:{" "}
                  {song.difficulty}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          {!selectedSong && (
            <div className="empty-detail">Soldan bir şarkı seç.</div>
          )}

          {selectedSong && (
            <>
              <h2>
                {selectedSong.title} – {selectedSong.artist}
              </h2>
              <p className="detail-meta">
                Ton: {selectedSong.key} | Capo: {selectedSong.capo} | Zorluk:{" "}
                {selectedSong.difficulty} | Etiketler:{" "}
                {selectedSong.tags.join(", ")}
              </p>
              <pre
                className="chords"
                dangerouslySetInnerHTML={{
                  __html: formatChords(selectedSong.chords),
                }}
              />
              <p>{selectedSong.notes}</p>
            </>
          )}
        </section>
      </main>

      <footer className="footer">Hazırlayan: Benim Repertuarım</footer>
    </div>
  );
}