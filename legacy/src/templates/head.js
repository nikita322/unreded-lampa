let html = `<div class="head">
    <div class="head__body">
        <div class="head__logo-icon">
            <img src="./img/logo-icon.svg" />
        </div>

        <div class="head__logo-icon head__logo-halloween hide">
            <div class="head__logo-halloween-fire"></div>
            <div class="head__logo-halloween-svg">
                <svg width="512" height="494" viewBox="0 0 512 494" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M247.135 95.8686C247.135 95.8686 253.636 43.2644 279.052 22.5773C304.467 1.89026 322.199 0.117081 322.199 0.117081L350.57 30.2611C350.57 30.2611 277.279 52.7213 272.55 120.693C268.413 189.256 247.135 95.8686 247.135 95.8686Z" fill="#68AA00"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M501.29 205.214C523.159 272.004 509.565 351.797 464.644 413.267C447.504 437.5 426.817 456.414 404.947 468.826C383.078 481.83 360.027 488.331 336.976 488.331C325.154 488.331 312.742 486.558 300.921 482.421L296.784 481.239L293.237 483.603C271.959 497.788 242.997 497.197 221.719 482.421L218.173 480.057L214.035 481.239C201.032 485.967 188.029 488.331 174.435 488.331C128.332 488.331 81.6383 460.552 46.7659 412.676C2.43651 351.206 -11.7489 271.413 10.1203 204.623C37.9 123.057 99.9612 105.325 147.246 105.325C180.316 105.325 207.326 113.717 213.37 115.595C214.132 115.831 214.56 115.965 214.626 115.965L218.764 117.147L222.31 114.782C243.588 100.006 272.55 99.4149 293.828 113.6L297.375 115.965L300.921 114.782C310.378 111.827 334.611 105.325 364.164 105.325C412.04 105.325 474.101 123.057 501.29 205.214ZM117.102 193.393L225.266 238.905C224.674 239.496 153.747 310.423 117.102 193.393ZM360.027 361.254L380.123 382.532L446.321 281.461L380.123 323.426L360.027 302.148L294.419 345.295L256.001 313.378L217.582 345.295L151.974 302.148L131.287 323.426L65.6797 281.461L131.287 382.532L151.974 361.254L217.582 404.401L256.001 372.484L294.419 404.401L360.027 361.254ZM401.401 193.393L293.237 238.905C293.237 239.496 364.755 310.423 401.401 193.393Z" fill="#F27503"/>
                    <path d="M297.375 481.83L301.512 483.012C313.333 486.558 325.154 488.922 337.567 488.922C360.618 488.922 384.26 481.83 405.538 469.418C427.407 456.414 447.503 437.5 465.235 413.858C509.565 352.388 523.75 272.595 501.881 205.805C474.101 123.057 412.04 105.326 364.755 105.326C335.202 105.326 310.378 111.827 301.512 114.782L297.375 115.965C297.375 115.965 367.119 140.789 401.401 193.393C401.401 193.393 401.401 193.393 401.401 193.393C416.236 216.082 428.736 251.977 430.192 291.686L446.321 281.461L430.227 306.034C428.159 370.406 395.544 441.591 297.375 481.83Z" fill="#D35C02"/>
                </svg>
            </div>
        </div>

        <div class="head__menu-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" x="0" y="0" viewBox="0 0 32 32" xml:space="preserve" style="width: 2.1em; height: 2.1em;">
                <path d="M29 8H3a2 2 0 0 1 0-4h26a2 2 0 0 1 0 4zM29 28H3a2 2 0 0 1 0-4h26a2 2 0 0 1 0 4zM29 18H3a2 2 0 0 1 0-4h26a2 2 0 0 1 0 4z" fill="currentColor"></path>
            </svg>
        </div>

        <div class="head__title"></div>
        
        <div class="head__actions">
            <div class="head__action head__settings selector open--search">
                <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="9.9964" cy="9.63489" r="8.43556" stroke="currentColor" stroke-width="2.4"/>
                    <path d="M20.7768 20.4334L18.2135 17.8701" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
            </div>

            <div class="head__action selector open--filter">
                <svg height="26" viewBox="0 0 38 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1.5" y="1.5" width="35" height="33" rx="1.5" stroke="currentColor" stroke-width="3"/>
                    <rect x="7" y="8" width="24" height="3" rx="1.5" fill="currentColor"/>
                    <rect x="7" y="16" width="24" height="3" rx="1.5" fill="currentColor"/>
                    <rect x="7" y="25" width="24" height="3" rx="1.5" fill="currentColor"/>
                    <circle cx="13.5" cy="17.5" r="3.5" fill="currentColor"/>
                    <circle cx="23.5" cy="26.5" r="3.5" fill="currentColor"/>
                    <circle cx="21.5" cy="9.5" r="3.5" fill="currentColor"/>
                </svg>
            </div>

            <!-- REMOVED: Broadcast button - Broadcast system removed (WebSocket dependency) -->

            <div class="head__action selector open--settings">
                <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.35883 18.1883L1.63573 17.4976L2.35883 18.1883L3.00241 17.5146C3.8439 16.6337 4.15314 15.4711 4.15314 14.4013C4.15314 13.3314 3.8439 12.1688 3.00241 11.2879L2.27931 11.9786L3.00241 11.2879L2.35885 10.6142C1.74912 9.9759 1.62995 9.01336 2.0656 8.24564L2.66116 7.19613C3.10765 6.40931 4.02672 6.02019 4.90245 6.24719L5.69281 6.45206C6.87839 6.75939 8.05557 6.45293 8.98901 5.90194C9.8943 5.36758 10.7201 4.51559 11.04 3.36732L11.2919 2.46324C11.5328 1.59833 12.3206 1 13.2185 1H14.3282C15.225 1 16.0121 1.59689 16.2541 2.46037L16.5077 3.36561C16.8298 4.51517 17.6582 5.36897 18.5629 5.90557C19.498 6.4602 20.6725 6.75924 21.8534 6.45313L22.6478 6.2472C23.5236 6.02019 24.4426 6.40932 24.8891 7.19615L25.4834 8.24336C25.9194 9.0118 25.7996 9.97532 25.1885 10.6135L24.5426 11.2882C23.7 12.1684 23.39 13.3312 23.39 14.4013C23.39 15.4711 23.6992 16.6337 24.5407 17.5146L25.1842 18.1883C25.794 18.8266 25.9131 19.7891 25.4775 20.5569L24.8819 21.6064C24.4355 22.3932 23.5164 22.7823 22.6406 22.5553L21.8503 22.3505C20.6647 22.0431 19.4876 22.3496 18.5541 22.9006C17.6488 23.4349 16.8231 24.2869 16.5031 25.4352L16.2513 26.3393C16.0103 27.2042 15.2225 27.8025 14.3246 27.8025H13.2184C12.3206 27.8025 11.5328 27.2042 11.2918 26.3393L11.0413 25.4402C10.7206 24.2889 9.89187 23.4336 8.98627 22.8963C8.05183 22.342 6.87822 22.0432 5.69813 22.3491L4.90241 22.5553C4.02667 22.7823 3.10759 22.3932 2.66111 21.6064L2.06558 20.5569C1.62993 19.7892 1.74911 18.8266 2.35883 18.1883Z" stroke="currentColor" stroke-width="2.4"/>
                    <circle cx="13.7751" cy="14.4013" r="4.1675" stroke="currentColor" stroke-width="2.4"/>
                </svg>
            </div>

            <!-- REMOVED: Premium button - Premium features removed -->
            <!-- REMOVED: Feed button - CUB feed system removed -->
            <!-- REMOVED: Notification button - Notification system removed -->

            <div class="head__action hide selector open--profile">
                <img />
            </div>

            <div class="head__action selector hide full-screen">
                <svg width="25" height="23" viewBox="0 0 25 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.51904 7.75323V5C1.51904 2.79086 3.3099 1 5.51904 1H8.46433" stroke="currentColor" stroke-width="2.7" stroke-linecap="round"/>
                    <path d="M1.51904 14.7305V17.4837C1.51904 19.6928 3.3099 21.4837 5.51904 21.4837H8.46433" stroke="currentColor" stroke-width="2.7" stroke-linecap="round"/>
                    <path d="M23.2815 7.75323V5C23.2815 2.79086 21.4906 1 19.2815 1H16.3362" stroke="currentColor" stroke-width="2.7" stroke-linecap="round"/>
                    <path d="M23.2815 14.7305V17.4837C23.2815 19.6928 21.4906 21.4837 19.2815 21.4837H16.3362" stroke="currentColor" stroke-width="2.7" stroke-linecap="round"/>
                </svg>
            </div>
        </div>

        <div class="head__split"></div>

        <div class="head__time">
            <div class="head__time-now time--clock"></div>
            <div>
                <div class="head__time-date time--full"></div>
                <div class="head__time-week time--week"></div>
            </div>
        </div>
    </div>
</div>`

export default html