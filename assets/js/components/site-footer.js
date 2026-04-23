class SiteFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .site-footer {
          background: rgba(49, 72, 94, 0.96);
        }
        .container {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
        }
        .site-footer__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          min-height: 76px;
          color: rgba(255, 255, 255, 0.76);
        }
        @media (max-width: 980px) {
          .site-footer__inner {
            flex-wrap: wrap;
            justify-content: center;
            padding: 14px 0;
          }
        }
      </style>
      <footer class="site-footer">
        <div class="container site-footer__inner">
          <span>© 2026 锦绣非遗 · Web 前端课程作品</span>
          <span>技术支持：HTML5 / CSS3 / JavaScript</span>
        </div>
      </footer>
    `;
  }
}

customElements.define('site-footer', SiteFooter);