class WindowManager {
    constructor() {
        this.windows = new Map();
        this.activeWindow = null;
        this.theme = 'dark';
        this.initializeDock();
        this.loadTheme();
    }

    initializeDock() {
        const dockItems = document.querySelectorAll('.dock-item');
        dockItems.forEach(item => {
            item.addEventListener('click', () => {
                const windowType = item.dataset.window;
                this.createWindow(windowType);
            });
        });
    }

    createWindow(type) {
        const windowContent = this.getWindowContent(type);
        const window = document.createElement('div');
        window.className = 'window';
        window.style.top = '50px';
        window.style.left = '50px';
        window.style.width = '600px';
        window.style.height = '400px';
        
        window.innerHTML = `
            <div class="window-header">
                <div class="traffic-lights">
                    <div class="traffic-light close"></div>
                    <div class="traffic-light minimize"></div>
                    <div class="traffic-light maximize"></div>
                </div>
                <div class="window-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
            </div>
            <div class="window-content">
                ${windowContent}
            </div>
        `;

        document.querySelector('.desktop').appendChild(window);
        this.makeWindowDraggable(window);
        this.setupTrafficLights(window);
        this.setupResizeObserver(window);
        this.bringToFront(window);

        if (type === 'settings') {
            const themeButtons = window.querySelectorAll('.theme-btn');
            themeButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const theme = btn.dataset.theme;
                    this.setTheme(theme);
                    
                    themeButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
            });
        }

        this.updateWindowTheme(window);
    }

    getWindowContent(type) {
        const content = {
            about: `
                <h2>About Me</h2>
                <p>Hi there! I'm Chris, a mostly beginner dev from the Netherlands. I have started getting into things like webdev and even some osdev by making my own kernel. I know a pretty decent bit of: HTML, CSS, Python, C and some light assembly. I'm still a student in high school but i am looking to study Computer Science at a Dutch University.</p>
            `,
            projects: `
                <h2>My Projects</h2>
                <ul>
                    <li>Modern Portfolio Website - MacOS inspired.</li>
                    <li>Weather app in C with gtk3 for UI.</li>
                    <li>Python Discord bot.</li>
                    <li>Own kernel in C and Assembly.</li>
                    <li>Multiple games in Swift for MacOS. </li>
                    <li>Custom home page for firefox in html and css. </li>
                    <li>A python script which turns weather into art. </li>
                    <li>And more soon to come, as i'm currently getting myself into a lot of front-end development.</li>

                </ul>
            `,
            skills: `
                <h2>Skills</h2>
                <ul>
                    <li>Frontend: HTML5, CSS3, JavaScript, Svelte</li>
                    <li>Backend: N JavaScript, Python, C</li>
                    <li>Tools: Git, Docker, Figma, Grafana</li>
                </ul>
            `,
            contact: `
                <h2>Contact Me</h2>
                <p>🐱 GitHub: github.com/christiaansp</p>
                <p>💬 Discord: discord.com/users/738324643324100629</p>
            `,
            settings: `
                <h2>Settings</h2>
                <div class="settings-section">
                    <div class="setting-item">
                        <label>Theme</label>
                        <div class="theme-toggle">
                            <button class="theme-btn ${this.theme === 'light' ? 'active' : ''}" data-theme="light">Light</button>
                            <button class="theme-btn ${this.theme === 'dark' ? 'active' : ''}" data-theme="dark">Dark</button>
                        </div>
                    </div>
                </div>
            `
        };
        return content[type] || '';
    }

    makeWindowDraggable(window) {
        const header = window.querySelector('.window-header');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            initialX = e.clientX - window.offsetLeft;
            initialY = e.clientY - window.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                window.style.left = `${currentX}px`;
                window.style.top = `${currentY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        window.addEventListener('mousedown', () => {
            this.bringToFront(window);
        });
    }

    setupTrafficLights(window) {
        const close = window.querySelector('.close');
        const minimize = window.querySelector('.minimize');
        const maximize = window.querySelector('.maximize');

        close.addEventListener('click', () => {
            window.remove();
        });

        minimize.addEventListener('click', () => {
            window.style.transform = 'scale(0.001)';
            window.style.opacity = '0';
            setTimeout(() => {
                window.style.display = 'none';
            }, 200);
        });

        maximize.addEventListener('click', () => {
            if (window.style.width === '100%') {
                window.style.width = '600px';
                window.style.height = '400px';
                window.style.top = '50px';
                window.style.left = '50px';
            } else {
                const padding = 20;
                window.style.width = `${document.documentElement.clientWidth - (padding * 2)}px`;
                window.style.height = `${document.documentElement.clientHeight - (padding * 2)}px`;
                window.style.top = `${padding}px`;
                window.style.left = `${padding}px`;
            }
        });
    }

    setupResizeObserver(window) {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const width = entry.contentRect.width;
                const height = entry.contentRect.height;
                
                if (width < 400) window.style.width = '400px';
                if (height < 300) window.style.height = '300px';
                
                const maxWidth = document.documentElement.clientWidth - 40;
                const maxHeight = document.documentElement.clientHeight - 40;
                
                if (width > maxWidth) window.style.width = `${maxWidth}px`;
                if (height > maxHeight) window.style.height = `${maxHeight}px`;
                
                const rect = window.getBoundingClientRect();
                if (rect.right > window.innerWidth) {
                    window.style.left = `${window.innerWidth - rect.width - 20}px`;
                }
                if (rect.bottom > window.innerHeight) {
                    window.style.top = `${window.innerHeight - rect.height - 20}px`;
                }
            }
        });

        resizeObserver.observe(window);
    }

    bringToFront(window) {
        const windows = document.querySelectorAll('.window');
        windows.forEach(w => {
            w.style.zIndex = '1';
        });
        window.style.zIndex = '2';
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.setTheme(savedTheme);
    }

    setTheme(theme) {
        this.theme = theme;
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        document.querySelectorAll('.window').forEach(window => {
            this.updateWindowTheme(window);
        });
    }

    updateWindowTheme(window) {
        if (this.theme === 'light') {
            window.style.background = 'rgba(255, 255, 255, 0.85)';
            window.querySelector('.window-header').style.background = 'rgba(220, 220, 220, 0.9)';
        } else {
            window.style.background = 'rgba(28, 28, 28, 0.85)';
            window.querySelector('.window-header').style.background = 'rgba(48, 48, 48, 0.9)';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WindowManager();
});
