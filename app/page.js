"use client";

import { useState, useMemo } from "react";
import { songs } from "../data/songs";

export default function Home() {
  const [search, setSearch] = useState("");
  const [keyFilter, setKeyFilter] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const filteredSongs = useMemo(
    () =>
      songs.filter((song) => {
        const s = search.toLowerCase();
        const matchesSearch =
          song.title.toLowerCase().includes(s) ||
          song.artist.toLowerCase().includes(s);
        const matchesKey = keyFilter ? song.key === keyFilter : true;
        return matchesSearch && matchesKey;
      }),
    [search, keyFilter]
  );

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
            <h2>Şarkılar</h2>
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
              <pre className="chords">{selectedSong.chords.trim()}</pre>
              <p>{selectedSong.notes}</p>
            </>
          )}
        </section>
      </main>

      <footer className="footer">Hazırlayan: Benim Repertuarım</footer>
    </div>
  );
}