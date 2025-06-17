console.log("lets write javascript");
let currentSong = new Audio();
let songs;
let currFolder;
let album="songs/ncs";
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getsongs(folder) {
    currFolder=folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }
    return songs

}
const playMusic = (track, pause = false) => {
    // let audio=new Audio("/songs/"+track)

    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}
async function main() {

    songs = await getsongs(album)
    playMusic(songs[0], true)
    let songUL = document.querySelector(".songlist").getElementsByTagName("UL")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>kiran</div>
                            </div>
                            <div class="playNow">
                                <span>Play Now</span>
                                <img class="invert" src="paly.svg" alt="playNow">

                            </div></li>`;
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })

    });
    const play = document.querySelector("#play")
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "paly.svg"
        }
    })
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.Duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

    })
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100

    })
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"

    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-130%"
    })
    previous.addEventListener("click", () => {
        console.log("previous clicked");
        console.log(currentSong);
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

        console.log(songs, index);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])

        }

    })
    next.addEventListener("click", () => {
        console.log("Next clicked");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

        console.log(songs, index);
        if ((index + 1) < songs.length -1) {
            playMusic(songs[index + 1])

        }


    })
    document.querySelector(".range input").addEventListener("change", (e) => {
        console.log(e, e.target, e.target.value);
        currentSong.volume = parseInt(e.target.value) / 100;
    });

}    


main()

