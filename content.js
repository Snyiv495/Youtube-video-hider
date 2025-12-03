let hide_counter = 0;
let hide_counter_element = null;
let settings = {
    hide_asmrs: false,
    old_threshold: 7,
    hide_old_videos: false,
    hide_watched_videos: false,
    hide_playlists: false,
    hide_mixlists: false,
    hide_lives: false,
    hide_archives: false,
    hide_sponsors: false,
    hide_shorts: false,
};

//ASMR判定
function isASMR(video){
    const title_text = video.querySelector(".yt-lockup-metadata-view-model__heading-reset")?.innerText || "";
    if(title_text.includes("ASMR")) return true;
    return false;
}

//古い動画判定
function isOldVideo(video){
    const element_texts = video.querySelectorAll(".yt-core-attributed-string");
    const date_text = (element_texts?.[element_texts.length-1]?.innerText || "").replace(/\s+/g, '');
    let match_date;

    if(match_date = date_text.match(/(\d+)日前/))   return (Number(match_date[1]) > (settings.old_threshold ?? 7));
    if(match_date = date_text.match(/(\d+)週間前/)) return (Number(match_date[1])*7 > (settings.old_threshold ?? 7));
    if(match_date = date_text.match(/(\d+)か月前/)) return (Number(match_date[1])*30 > (settings.old_threshold ?? 7));
    if(match_date = date_text.match(/(\d+)年前/))   return (Number(match_date[1])*365 > (settings.old_threshold ?? 7));

    return false;
}

//視聴済み判定
function isWatchedVideo(video){
    if(video.querySelector("yt-thumbnail-overlay-progress-bar-view-model, ytd-thumbnail-overlay-resume-playback-renderer")) return true;
    return false;
}

//プレイリスト判定
function isPlayList(video){
    const badge_text = video.querySelector(".yt-badge-shape__text")?.innerText || "";
    if(badge_text.includes("本の動画")) return true;
    return false;
}

//ミックスリスト判定
function isMixList(video){
    const badge_text = video.querySelector(".yt-badge-shape__text")?.innerText || "";
    if(badge_text.includes("ミックスリスト")) return true;
    return false;
}

//ライブ配信判定
function isLive(video){
    const badge_text = video.querySelector(".yt-badge-shape__text")?.innerText || "";
    const avatar_badge_text = video.querySelector(".yt-spec-avatar-shape__badge-text")?.innerText || "";

    if(badge_text.includes("ライブ")) return true;
    if(avatar_badge_text.includes("ライブ")) return true;

    return false;
}

//アーカイブ判定
function isArchive(video){
    const row_text = video.querySelectorAll(".yt-content-metadata-view-model__metadata-row")[1]?.innerText || "";
    if(row_text.includes("配信済み")) return true;
    return false;
}

//スポンサー判定
function isSponsor(video){
    const badge_text = video.querySelector(".yt-badge-shape__text")?.innerText || "";
    if(badge_text.includes("スポンサー")) return true;
    return false;
}

//ショートコンテナ判定
function isShortContainer(section){
    const section_title = section.querySelector("#title")?.innerText || "";
    if(section_title.includes("ショート")) return true;
    return false;
}

//非表示化
function hide(){
    const short_containers = document.querySelectorAll("ytd-rich-section-renderer, ytd-reel-shelf-renderer");
    const videos = document.querySelectorAll("ytd-rich-item-renderer, yt-lockup-view-model, ytd-video-renderer");

    //ショート動画コンテナ
    short_containers.forEach(short_container => {
        try{
            if(short_container.style.display === "none") return;
            if(settings.hide_shorts && isShortContainer(short_container)){short_container.style.display = "none"; hide_counter++; return;}
            return;
        }catch(e){/*ignore*/}
    })

    //動画
    videos.forEach(video => {
        try{
            if(video.style.display === "none") return;
            if(settings.hide_asmrs==="true" && isASMR(video)){video.style.display = "none"; hide_counter++; return;}
            if(settings.hide_asmrs==="exclusive" && !isASMR(video)){video.style.display = "none"; hide_counter++; return;}
            if(settings.hide_old_videos && isOldVideo(video)){video.style.display = "none"; hide_counter++; return;}
            if(settings.hide_watched_videos && isWatchedVideo(video)){video.style.display = "none"; hide_counter++; return;}
            if(settings.hide_playlists && isPlayList(video)){video.style.display = "none"; hide_counter++; return;}
            if(settings.hide_mixlists && isMixList(video)){video.style.display = "none"; hide_counter++; return;}
            if(settings.hide_lives && isLive(video)){video.style.display = "none"; hide_counter++; return;}
            if(settings.hide_archives && isArchive(video)){video.style.display = "none"; hide_counter++; return;}
            if(settings.hide_sponsors && isSponsor(video)){video.style.display = "none"; hide_counter++; return;}
            return;
        }catch(e){/*ignore*/}
    });

    //カウンターの更新
    hide_counter_element.textContent = hide_counter.toString();
}

//再非表示
function reHide(){
    hide_counter = 0;
    document.querySelectorAll("ytd-rich-section-renderer, ytd-reel-shelf-renderer, ytd-rich-item-renderer, yt-lockup-view-model, ytd-video-renderer").forEach(element => {
        delete element.style.display;
        element.style.display = "";
    });

    hide();
}

//アイコンの挿入
function insertIcon(){
    const logo = document.querySelector("#logo");
    const wrapper = document.createElement("div");
    const button = document.createElement("img");

    if(!logo || !logo.parentElement) return;
    if(document.getElementById("yt-hide-video-icon")) return;

    wrapper.id = "yt-hide-video-wrapper";
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.gap = "6px";

    button.src = chrome.runtime.getURL("icon/icon.svg");
    button.id = "yt-hide-video-icon";

    Object.assign(button.style,
        {
            width: "32px",
            height: "32px",
            cursor: "pointer",
            opacity: "0.82",
            transition: "0.25s",
            userSelect: "none",
        }
    );

    button.addEventListener("mouseenter", () => {button.style.opacity = "1";});
    button.addEventListener("mouseleave", () => {button.style.opacity = "0.8";});
    button.addEventListener("click", () => {chrome.runtime.sendMessage({action: "open_options"});});

    hide_counter_element = document.createElement("span");
    hide_counter_element.id = "yt-hide-video-counter";
    hide_counter_element.textContent = "0";

    Object.assign(hide_counter_element.style, {
        color: "#aaa",
        fontSize: "13px",
        fontWeight: "600",
        minWidth: "18px",
        textAlign: "center",
    });

    wrapper.appendChild(button);
    wrapper.appendChild(hide_counter_element);

    logo.parentElement.insertBefore(wrapper, logo.nextSibling);
}

//設定の取得
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
    
    (res) => {
        settings = {...settings, ...res};
    }
);

//設定の更新
chrome.storage.onChanged.addListener((changes) => {
    for(const change in changes){
        settings[change] = changes[change].newValue;
    }
    reHide();
});

//監視
const hide_observer = new MutationObserver(() => {requestAnimationFrame(hide);});
const icon_observer = new MutationObserver(() => {insertIcon();});
hide_observer.observe(document.body, {childList: true, subtree: true});
icon_observer.observe(document.body, {childList: true, subtree: true});

//初回実行
insertIcon();
hide();