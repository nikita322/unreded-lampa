let html = `<div>
    <div class="settings-param selector" data-type="select" data-name="metadata_source" data-children="metadata_source">
        <div class="settings-param__name">#{settings_rest_metadata_source}</div>
        <div class="settings-param__value"></div>
        <div class="settings-param__descr">#{settings_rest_metadata_source_descr}</div>
    </div>

    <div class="settings-param selector" data-parent="metadata_source" data-visible-value="kinopoisk" data-type="input" data-name="kinopoisk_api_key" placeholder="#{settings_rest_kinopoisk_api_key_placeholder}">
        <div class="settings-param__name">#{settings_rest_kinopoisk_api_key}</div>
        <div class="settings-param__value"></div>
        <div class="settings-param__descr">#{settings_rest_kinopoisk_api_key_descr}</div>
    </div>

    <div class="settings-param selector" data-type="select" data-name="poster_size">
        <div class="settings-param__name">#{settings_rest_metadata_posters}</div>
        <div class="settings-param__value"></div>
    </div>

    <div class="settings-param selector" data-type="toggle" data-name="proxy_tmdb" data-children="proxy">
        <div class="settings-param__name">#{settings_rest_metadata_proxy}</div>
        <div class="settings-param__value"></div>
    </div>

    <div class="settings-param selector" data-parent="proxy" data-type="select" data-name="proxy_type">
        <div class="settings-param__name">#{settings_rest_proxy_type}</div>
        <div class="settings-param__value"></div>
        <div class="settings-param__descr">#{settings_rest_proxy_type_descr}</div>
    </div>

    <div class="settings-param selector" data-parent="proxy" data-type="input" data-name="proxy_host" placeholder="#{settings_rest_proxy_example}">
        <div class="settings-param__name">#{settings_rest_proxy_host}</div>
        <div class="settings-param__value"></div>
        <div class="settings-param__descr">#{settings_rest_proxy_host_descr}</div>
    </div>

    <div class="settings-param selector" data-parent="proxy" data-type="input" data-name="proxy_username" placeholder="">
        <div class="settings-param__name">#{settings_rest_proxy_username}</div>
        <div class="settings-param__value"></div>
        <div class="settings-param__descr">#{settings_rest_proxy_username_descr}</div>
    </div>

    <div class="settings-param selector" data-parent="proxy" data-type="input" data-name="proxy_password" placeholder="">
        <div class="settings-param__name">#{settings_rest_proxy_password}</div>
        <div class="settings-param__value"></div>
        <div class="settings-param__descr">#{settings_rest_proxy_password_descr}</div>
    </div>
</div>`

export default html
