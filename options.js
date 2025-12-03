const hide_count = document.getElementById("hide_count");
const hide_asmrs = document.getElementById("hide_asmrs");
const hide_old_videos = document.getElementById("hide_old_videos");
const hide_watched_videos = document.getElementById("hide_watched_videos");
const hide_playlists = document.getElementById("hide_playlists");
const hide_mixlists = document.getElementById("hide_mixlists");
const hide_lives = document.getElementById("hide_lives");
const hide_archives = document.getElementById("hide_archives");
const hide_sponsors = document.getElementById("hide_sponsors");
const hide_shorts = document.getElementById("hide_shorts");
const old_threshold = document.getElementById("old_threshold");
const save_button = document.getElementById("save");

function getHideCount(){
    chrome.storage.local.get('hide_count',
        (data) => {
            hide_count.textContent = (data.hide_count ?? 0).toString();
        }
    );
}

function showToast(message){
    const toast = document.getElementById("toast");
    if(!toast) return;

    toast.textContent = message;
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(-8px)";

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(0)";
    }, 2200);
}

getHideCount();

chrome.storage.sync.get(
    {
        hide_asmrs: false,
        old_threshold: 7,
        hide_old_videos: false,
        hide_watched_videos: false,
        hide_playlists: false,
        hide_mixlists: false,
        hide_lives: false,
        hide_archives: false,
        hide_sponsors: false,
        hide_shorts: false
    },

    (data) => {
        hide_asmrs.value = data.hide_asmrs;
        old_threshold.value = data.old_threshold;
        hide_old_videos.checked = data.hide_old_videos;
        hide_watched_videos.checked = data.hide_watched_videos;
        hide_playlists.checked = data.hide_playlists;
        hide_mixlists.checked = data.hide_mixlists;
        hide_lives.checked = data.hide_lives;
        hide_archives.checked = data.hide_archives;
        hide_sponsors.checked = data.hide_sponsors;
        hide_shorts.checked = data.hide_shorts;
    }
);


save_button.addEventListener("click", () => {
    chrome.storage.sync.set(
        {
            hide_asmrs: hide_asmrs.value,
            old_threshold: Number(old_threshold.value),
            hide_old_videos: hide_old_videos.checked,
            hide_watched_videos: hide_watched_videos.checked,
            hide_playlists: hide_playlists.checked,
            hide_mixlists: hide_mixlists.checked,
            hide_lives: hide_lives.checked,
            hide_archives: hide_archives.checked,
            hide_sponsors: hide_sponsors.checked,
            hide_shorts: hide_shorts.checked
        },
        () => showToast("保存しました！")
    );
    setTimeout(() => {getHideCount();}, 500);
});
