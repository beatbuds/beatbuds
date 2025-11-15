import '../styling/musicPlayer.css'

function MusicPlayer() {
    return(
    <>
    <div class="player-container">

        <div class="album-container">

        </div>
        <div class="music-control-container">
            <div class="previous-button">
                <button><svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960"
                width="48px" fill="#e3e3e3">
                <path d="M640-200 200-480l440-280v560Zm-80-280Zm0 134v-268L350-480l210 134Z"/></svg>
                </button>
            </div>
            <div class="play-button">
                <button><svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" 
                width="48px" fill="#e3e3e3">
                <path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/></svg>
                </button>
            </div>
            <div class="next-button">
                <button><svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" 
                width="48px" transform="rotate(180)" fill="#e3e3e3">
                <path d="M640-200 200-480l440-280v560Zm-80-280Zm0 134v-268L350-480l210 134Z"/></svg>
                </button>
            </div>
        </div>
    </div>
    </>
    )
}

export default MusicPlayer;