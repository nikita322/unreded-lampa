let html = `<div class="full-start">

    <div class="full-start__body">
        <div class="full-start__right">
            <div class="full-start__poster">
                <img class="full-start__img full--poster" />
            </div>
        </div>

        <div class="full-start__left">
            <div class="full-start__deta">
                <div class="info__rate"><span>{rating}</span><div class="source--name">Metadata</div></div>

                <div class="full-start__rate rate--imdb hide"><div></div><div>IMDB</div></div>
                <div class="full-start__rate rate--kp hide"><div></div><div>KP</div></div>

                <div class="full-start__pg hide"></div>
            </div>

            <div class="full-start__title">{title}</div>
            <div class="full-start__title-original">{original_title}</div>

            <div class="full-start__tags">
                <div class="full-start__tag tag--quality hide">
                    <div></div>
                </div>
                <div class="full-start__tag tag--year hide">
                    <img src="./img/icons/add.svg" /> <div></div>
                </div>
                <div class="full-start__tag tag--countries">
                    <div>{countries}</div>
                </div>
                <div class="full-start__tag tag--genres">
                    <img src="./img/icons/pulse.svg" /> <div>{genres}</div>
                </div>
                <div class="full-start__tag tag--time">
                    <img src="./img/icons/time.svg" /> <div>{time}</div>
                </div>
                <div class="full-start__tag hide is--serial">
                    <img src="./img/icons/menu/catalog.svg" /> <div>{seasons}</div>
                </div>
                <div class="full-start__tag hide is--serial">
                    <img src="./img/icons/menu/movie.svg" /> <div>{episodes}</div>
                </div>
                <div class="full-start__tag tag--episode hide">
                    <img src="./img/icons/time.svg" /> <div></div>
                </div>
            </div>

            <!-- REMOVED: Reactions block - CUB reactions system removed -->

            <!--
            <div class="full-start__icons">
                <div class="info__icon icon--book selector" data-type="book"></div>
                <div class="info__icon icon--like selector" data-type="like"></div>
                <div class="info__icon icon--wath selector" data-type="wath"></div>
                <div class="info__icon button--subscribe selector hide" data-type="subscribe">
                    <svg enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g><path fill="currentColor" d="m411 262.862v-47.862c0-69.822-46.411-129.001-110-148.33v-21.67c0-24.813-20.187-45-45-45s-45 20.187-45 45v21.67c-63.59 19.329-110 78.507-110 148.33v47.862c0 61.332-23.378 119.488-65.827 163.756-4.16 4.338-5.329 10.739-2.971 16.267s7.788 9.115 13.798 9.115h136.509c6.968 34.192 37.272 60 73.491 60 36.22 0 66.522-25.808 73.491-60h136.509c6.01 0 11.439-3.587 13.797-9.115s1.189-11.929-2.97-16.267c-42.449-44.268-65.827-102.425-65.827-163.756zm-170-217.862c0-8.271 6.729-15 15-15s15 6.729 15 15v15.728c-4.937-.476-9.94-.728-15-.728s-10.063.252-15 .728zm15 437c-19.555 0-36.228-12.541-42.42-30h84.84c-6.192 17.459-22.865 30-42.42 30zm-177.67-60c34.161-45.792 52.67-101.208 52.67-159.138v-47.862c0-68.925 56.075-125 125-125s125 56.075 125 125v47.862c0 57.93 18.509 113.346 52.671 159.138z"></path><path fill="currentColor" d="m451 215c0 8.284 6.716 15 15 15s15-6.716 15-15c0-60.1-23.404-116.603-65.901-159.1-5.857-5.857-15.355-5.858-21.213 0s-5.858 15.355 0 21.213c36.831 36.831 57.114 85.8 57.114 137.887z"></path><path fill="currentColor" d="m46 230c8.284 0 15-6.716 15-15 0-52.086 20.284-101.055 57.114-137.886 5.858-5.858 5.858-15.355 0-21.213-5.857-5.858-15.355-5.858-21.213 0-42.497 42.497-65.901 98.999-65.901 159.099 0 8.284 6.716 15 15 15z"></path></g></svg>
                </div>
            </div>
            -->
        </div>
    </div>

    <div class="full-start__footer">
            <div class="full-start__buttons-scroll"></div>

            <div class="full-start__buttons">
                <div class="full-start__button view--torrent hide">
                    <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="50px" height="50px">
                        <path d="M25,2C12.317,2,2,12.317,2,25s10.317,23,23,23s23-10.317,23-23S37.683,2,25,2z M40.5,30.963c-3.1,0-4.9-2.4-4.9-2.4 S34.1,35,27,35c-1.4,0-3.6-0.837-3.6-0.837l4.17,9.643C26.727,43.92,25.874,44,25,44c-2.157,0-4.222-0.377-6.155-1.039L9.237,16.851 c0,0-0.7-1.2,0.4-1.5c1.1-0.3,5.4-1.2,5.4-1.2s1.475-0.494,1.8,0.5c0.5,1.3,4.063,11.112,4.063,11.112S22.6,29,27.4,29 c4.7,0,5.9-3.437,5.7-3.937c-1.2-3-4.993-11.862-4.993-11.862s-0.6-1.1,0.8-1.4c1.4-0.3,3.8-0.7,3.8-0.7s1.105-0.163,1.6,0.8 c0.738,1.437,5.193,11.262,5.193,11.262s1.1,2.9,3.3,2.9c0.464,0,0.834-0.046,1.152-0.104c-0.082,1.635-0.348,3.221-0.817,4.722 C42.541,30.867,41.756,30.963,40.5,30.963z" fill="currentColor"/>
                    </svg>

                    <span>#{full_torrents}</span>
                </div>

                <!-- REMOVED: Trailer button - YouTube/trailers removed -->

                <div class="full-start__button selector button--book">
                    <svg width="21" height="32" viewBox="0 0 21 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 1.5H19C19.2761 1.5 19.5 1.72386 19.5 2V27.9618C19.5 28.3756 19.0261 28.6103 18.697 28.3595L12.6212 23.7303C11.3682 22.7757 9.63183 22.7757 8.37885 23.7303L2.30302 28.3595C1.9739 28.6103 1.5 28.3756 1.5 27.9618V2C1.5 1.72386 1.72386 1.5 2 1.5Z" stroke="currentColor" stroke-width="2.5"/>
                    </svg>

                </div>

                <!-- REMOVED: Reaction button - CUB reactions system removed -->
                <!-- REMOVED: Subscribe button - CUB subscriptions removed -->
            </div>
    </div>
</div>`

export default html