class VideoModal {
  static show(videoUrl) {
    let modal = document.getElementById('videoModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'videoModal';
      modal.className = 'video-modal';
      modal.innerHTML = `
        <div class="video-modal__backdrop"></div>
        <div class="video-modal__container">
          <button type="button" class="video-modal__close" aria-label="关闭">&times;</button>
          <iframe class="video-modal__iframe" frameborder="no" scrolling="no" width="100%" height="100%" allowfullscreen></iframe></p>
        </div>
      `;
      document.body.appendChild(modal);

      const backdrop = modal.querySelector('.video-modal__backdrop');
      const closeBtn = modal.querySelector('.video-modal__close');

      const close = () => {
        modal.classList.remove('video-modal--open');
        setTimeout(() => {
          modal.querySelector('.video-modal__iframe').src = '';
        }, 300);
      };

      backdrop.addEventListener('click', close);
      closeBtn.addEventListener('click', close);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
      });
    }

    const iframe = modal.querySelector('.video-modal__iframe');
    iframe.src = videoUrl;
    modal.classList.add('video-modal--open');
  }

  static init() {
    if (!document.getElementById('videoModal')) {
      const style = document.createElement('style');
      style.textContent = `
        .video-modal {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 9999;
        }
        .video-modal--open {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .video-modal__backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
        }
        .video-modal__container {
          position: relative;
          width: 90%;
          max-width: 900px;
          aspect-ratio: 16 / 9;
          background: #000;
          border-radius: 8px;
          overflow: hidden;
        }
        .video-modal__iframe {
          width: 100%;
          height: 100%;
        }
        .video-modal__close {
          position: absolute;
          top: -40px;
          right: 0;
          background: none;
          border: none;
          color: #fff;
          font-size: 32px;
          cursor: pointer;
          line-height: 1;
        }
      `;
      document.head.appendChild(style);
    }
  }
}

if (typeof window !== 'undefined') {
  window.VideoModal = VideoModal;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => VideoModal.init());
} else {
  VideoModal.init();
}