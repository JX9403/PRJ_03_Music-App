import React, { useEffect, useRef, useState } from "react";
import "../assets/css/card.css";
import musics from "../assets/data";
import timer from "../utils/timer";

export default function Card({ props: { musicNumber, setMusicNumber } }) {
  // console.log(data);

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [play, setPlay] = useState(false);
  const [volume, setVolume] = useState(50);
  const [openVolume, setOpenVolume] = useState(false);
  const [repeat, setRepeat] = useState("repeat");
  const audioRef = useRef();
  const handleSong = (id) => {
    setMusicNumber(id);
  };

  const handleLoadStart = (e) => {
    const src = e.nativeEvent.srcElement.src;
    const audio = new Audio(src);
    audio.onloadedmetadata = () => {
      if (audio.readyState > 0) {
        setDuration(audio.duration);
      }
    };
    if (play) {
      audioRef.current.play();
    }
  };

  const handlePlayingAudio = () => {
    if (play) {
      audioRef.current.pause();
      setPlay(false);
    } else {
      audioRef.current.play();
      setPlay(true);
    }
  };

  const handleTimeUpdate = () => {
    const currentTime = audioRef.current.currentTime;
    setCurrentTime(currentTime);
  };

  const changeCurrentTime = (e) => {
    const currentTime = Number(e.target.value);
    audioRef.current.currentTime = currentTime;
    setCurrentTime(currentTime);
  };

  const handleNext = () => {
    setMusicNumber(value => {
      if( value + 1 > musics.length - 1){
        return 0;
      } else return value + 1;
    });
   
  };

  const handlePrev = () => {
    setMusicNumber(value => {
      if( value - 1 < 0 ){
        return musics.length-1;
      } else return value - 1;
    });

  };

  const handleRepeat = () => {
    setRepeat((value) => {
      switch (value) {
        case "repeat":
          return "repeat_one";
        case "repeat_one":
          return "shuffle";
        default:
          return "repeat";
      }
    });
  };

  const EndedAudio = () => {
    switch (repeat) {
      case "repeat_one":
        return audioRef.current.play();
      case "shuffle":
        return handleShuffle();
        default:
          return handleNext();
    }
  };

  const handleShuffle = () => {
    let num = Math.floor(Math.random() * (musics.length - 1)) ;
    if(num === musicNumber){
      num = Math.floor(Math.random() * (musics.length - 1)) ;
    }
    setMusicNumber(num);
  }
  useEffect(() => {
    audioRef.current.volume = volume / 100;
  }, [volume]);
  return (
    <>
      <div className="card">
        <div className="top">
          <div className="text">MUSIC APP</div>{" "}
        </div>
        <div className="content">
          <div className="left">
            <div className="nav">
              <i className="material-symbols-outlined">expand_more</i>
              <span>
                Now playing {musicNumber + 1} / {musics.length}
              </span>
              <i className="material-symbols-outlined">queue_music</i>
            </div>
            <div className="img">
              <img src={musics[musicNumber].thumbnail} alt=""  className={play ? "playing" : ''}/>
            </div>

            <div className="details">
              <p className="title">{musics[musicNumber].title}</p>
              <p className="artist">{musics[musicNumber].artist}</p>
            </div>

            <div className="progress">
              <input
                type="range"
                min={0}
                max={duration}
                value={currentTime}
                onChange={(e) => changeCurrentTime(e)}
              />
            </div>

            <div className="timer">
              <span>{timer(currentTime)}</span>
              <span>{timer(duration)}</span>
            </div>

            <div className="controls">
              <i
                className="material-symbols-outlined repeat"
                onClick={handleRepeat}
              >
                {repeat}
              </i>
              <i
                className="material-symbols-outlined"
                id="prev"
                onClick={() => handlePrev()}
              >
                skip_previous
              </i>
              <div className="play" onClick={handlePlayingAudio}>
                <i className="material-symbols-outlined">
                  {play ? "pause" : "play_arrow"}
                </i>
              </div>
              <i
                className="material-symbols-outlined"
                id="next"
                onClick={() => handleNext()}
              >
                skip_next
              </i>

              <div className="volume">
                <i
                  className="material-symbols-outlined icon"
                  id="next"
                  onClick={() => {
                    setOpenVolume(!openVolume);
                  }}
                >
                  {volume === 0 ? "volume_off" : "volume_up"}
                </i>
                <div className={openVolume ? "loa show" : "loa"}>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    value={volume}
                  />
                </div>
              </div>
            </div>
            <audio
              src={musics[musicNumber].src}
              hidden
              onLoadStart={handleLoadStart}
              ref={audioRef}
              onTimeUpdate={handleTimeUpdate}
              onEnded={EndedAudio}
            ></audio>
          </div>

          <div className="right">
            <table>
              <thead>
                <tr className="row-h">
                  <th className="col col-1">#</th>
                  <th className="col col-2">Title</th>
                  <th className="col col-3">Author</th>
                </tr>
              </thead>
              <tbody>
                {musics.map((song) => (
                  <tr
                    key={song.id}
                    className="row"
                    onClick={() => {
                      // console.log()
                      handleSong(song.id - 1);
                    }}
                  >
                    <td className="col col-1">{song.id}</td>
                    <td className="col col-2">{song.title}</td>
                    <td className="col col-3">{song.artist}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
