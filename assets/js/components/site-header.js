class SiteHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  get pageType() {
    return this.getAttribute('page') || 'default';
  }

  render() {
    const isLoginPage = this.pageType === 'login';
    const fullNav = `
      <nav class="main-nav" aria-label="主导航">
        <ul>
          <li><a data-nav="home" href="index.html">首页</a></li>
          <li><a data-nav="expo" href="expo.html">博览</a></li>
          <li><a data-nav="workshop" href="workshop.html">工坊</a></li>
          <li><a data-nav="library" href="library.html">智库</a></li>
          <li><a data-nav="contact" href="contact.html">关于</a></li>
        </ul>
      </nav>
    `;

    const simpleNav = `
      <nav class="main-nav" aria-label="主导航">
        <ul>
          <li><a data-nav="home" href="index.html">首页</a></li>
          <li><a data-nav="contact" href="contact.html">关于</a></li>
        </ul>
      </nav>
    `;

    const fullUtility = `
      <ul class="utility-nav">
        <li><span data-username>未登录访客</span></li>
        <li><a href="login.html">登录</a></li>
        <li><a href="#" data-logout>退出</a></li>
        <li><span>收藏 <strong data-collection-count>0</strong></span></li>
      </ul>
    `;

    const simpleUtility = `
      <ul class="utility-nav">
        <li><span data-username>未登录访客</span></li>
      </ul>
    `;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .site-header {
          background: rgba(244, 241, 232, 0.78);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(49, 72, 94, 0.08);
        }
        .container {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
        }
        .site-header__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          min-height: 80px;
        }
        .logo {
          font-family: "STKaiti", "KaiTi", "Songti SC", serif;
          font-size: 30px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #31485E;
          text-decoration: none;
        }
        .main-nav ul,
        .utility-nav {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .main-nav a,
        .utility-nav a,
        .utility-nav span {
          position: relative;
          color: #5D697A;
          text-decoration: none;
        }
        .main-nav a.is-active,
        .main-nav a:hover,
        .utility-nav a:hover {
          color: #31485E;
        }
        .main-nav a.is-active::after,
        .main-nav a:hover::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -8px;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, #BF4C3C, #CDA35F);
          border-radius: 999px;
        }
        @media (max-width: 980px) {
          .site-header__inner {
            flex-wrap: wrap;
            justify-content: center;
            padding: 14px 0;
          }
        }
        @media (max-width: 680px) {
          .main-nav ul,
          .utility-nav {
            flex-wrap: wrap;
            justify-content: center;
          }
          .logo {
            font-size: 26px;
          }
        }
      </style>
      <header class="site-header">
        <div class="container site-header__inner">
          <a class="logo" href="index.html">锦绣非遗</a>
          ${isLoginPage ? simpleNav : fullNav}
          ${isLoginPage ? simpleUtility : fullUtility}
        </div>
      </header>
    `;
  }

  bindEvents() {
    setTimeout(() => {
      this.highlightNav();
      this.updateUsernameUI();
      this.updateCollectionBadge();
      this.bindLogout();
    }, 0);
  }

  highlightNav() {
    const currentPage = document.body?.getAttribute('data-page');
    if (!currentPage) return;

    this.shadowRoot.querySelectorAll('[data-nav]').forEach(link => {
      const active = link.getAttribute('data-nav') === currentPage;
      link.classList.toggle('is-active', active);
    });
  }

  updateUsernameUI() {
    const target = this.shadowRoot.querySelector('[data-username]');
    if (!target) return;

    const username = this.getUsername();
    target.textContent = username ? `欢迎你，${username}` : '未登录访客';
  }

  updateCollectionBadge() {
    const target = this.shadowRoot.querySelector('[data-collection-count]');
    if (!target) return;

    try {
      const items = JSON.parse(localStorage.getItem('heritage.collection') || '[]');
      target.textContent = String(items.length);
    } catch {
      target.textContent = '0';
    }
  }

  getUsername() {
    try {
      return (localStorage.getItem('heritage.username') || '').trim();
    } catch {
      return '';
    }
  }

  bindLogout() {
    const trigger = this.shadowRoot.querySelector('[data-logout]');
    if (!trigger || trigger.dataset.logoutReady === 'true') return;

    trigger.dataset.logoutReady = 'true';
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      try {
        localStorage.removeItem('heritage.username');
      } catch {}
      window.location.href = 'login.html';
    });
  }
}

customElements.define('site-header', SiteHeader);