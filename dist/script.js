const fan = document.getElementById('fan');
const dialog = document.getElementById('story-window');
const closeButton = document.getElementById('close-window');
let stories = [];
let currentIndex = 0;

function openStory(index) {
  currentIndex = (index + stories.length) % stories.length;
  const story = stories[currentIndex];
  document.getElementById('story-image').src = story.image;
  document.getElementById('story-image').alt = story.alt;
  document.getElementById('visual-caption').textContent = `FUJI, JAPAN · ${story.number}`;
  document.getElementById('story-number').textContent = `POSTCARD ${story.number}`;
  document.getElementById('story-date').textContent = story.date;
  document.getElementById('story-title').textContent = story.title;
  document.getElementById('story-subtitle').textContent = story.subtitle;
  document.getElementById('story-copy').textContent = story.text;
  document.getElementById('story-credit').textContent = story.credit;
  document.getElementById('story-progress').textContent = `${story.number} / 0${stories.length}`;
  dialog.querySelector('.window-body').scrollTop = 0;
  dialog.querySelector('.window-story').scrollTop = 0;
  if (!dialog.open) dialog.showModal();
}

function createPostcard(story, index) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'postcard';
  card.setAttribute('aria-label', `開啟第 ${index + 1} 張明信片：${story.title}，閱讀原文`);
  card.innerHTML = `<img class="postcard-photo" src="${story.image}" alt="${story.alt}" draggable="false"><span class="postcard-bottom"><span><span class="postcard-title">${story.title}</span><span class="postcard-subtitle">${story.subtitle}</span></span><span class="postcard-no">${story.number}</span></span>`;
  card.addEventListener('click', () => openStory(index));
  return card;
}

async function init() {
  try {
    const response = await fetch('captions.json');
    if (!response.ok) throw new Error('Could not load captions');
    stories = await response.json();
    stories.forEach((story, index) => fan.appendChild(createPostcard(story, index)));
  } catch (error) {
    fan.innerHTML = '<p class="load-error">明信片暫時無法載入，請重新整理頁面。</p>';
    console.error(error);
  }
}

closeButton.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
document.getElementById('previous-story').addEventListener('click', () => openStory(currentIndex - 1));
document.getElementById('next-story').addEventListener('click', () => openStory(currentIndex + 1));
document.addEventListener('keydown', event => {
  if (!dialog.open) return;
  if (event.key === 'ArrowLeft') openStory(currentIndex - 1);
  if (event.key === 'ArrowRight') openStory(currentIndex + 1);
});

init();
