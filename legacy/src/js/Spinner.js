define(['spin'], function (Spinner) {
    var opts = {
        lines: 17, // The number of lines to draw
        length: 0, // The length of each line
        width: 10, // The line thickness
        radius: 48, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#000', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 66, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent in px
        left: '50%' // Left position relative to parent in px
    };
    //return new Spinner(opts);


    var spinner = function (type) {
        this.type = type;
    };

    spinner.prototype.spin = function () {
        var holder = $("#epub-reader-frame .spinner-holder");
        if (holder.length === 0) {
            var div = `<div class="spinner-holder" ></div>`;
            $("#epub-reader-frame").append(div);
            var spin = getSvgSpinner(this.type);
            holder = $("#epub-reader-frame .spinner-holder");
            holder.append($(spin));
        }
        holder.show();
    };

    spinner.prototype.stop = function () {
        var holder = $("#epub-reader-frame .spinner-holder");
        if (holder.length > 0) {
            holder.hide();
        }
    };



    return {
        createSpinner : function (sptype) {
            if(sptype){
                return new spinner(sptype);
            }
            return new Spinner(opts);
        }
    };


    function getSvgSpinner(type) {
        switch (type) {
            case 'one' :
                return `<svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                       width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
                      <path opacity="0.2" fill="#000" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
                        s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
                        c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/>
                      <path fill="#000" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
                        C22.32,8.481,24.301,9.057,26.013,10.047z">
                        <animateTransform attributeType="xml"
                          attributeName="transform"
                          type="rotate"
                          from="0 20 20"
                          to="360 20 20"
                          dur="0.5s"
                          repeatCount="indefinite"/>
                        </path>
                      </svg>`;
            case 'two' :
                return `<svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                         width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                      <path fill="#000" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
                        <animateTransform attributeType="xml"
                          attributeName="transform"
                          type="rotate"
                          from="0 25 25"
                          to="360 25 25"
                          dur="0.6s"
                          repeatCount="indefinite"/>
                        </path>
                      </svg>`;
            case 'three' :
                return `<svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                     width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                  <path fill="#000" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
                    <animateTransform attributeType="xml"
                      attributeName="transform"
                      type="rotate"
                      from="0 25 25"
                      to="360 25 25"
                      dur="0.6s"
                      repeatCount="indefinite"/>
                    </path>
                  </svg>`;
            case 'four' :
                return `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                         width="24px" height="24px" viewBox="0 0 24 24" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                        <rect x="0" y="0" width="4" height="7" fill="#333">
                          <animateTransform  attributeType="xml"
                            attributeName="transform" type="scale"
                            values="1,1; 1,3; 1,1"
                            begin="0s" dur="0.6s" repeatCount="indefinite" />       
                        </rect>
                    
                        <rect x="10" y="0" width="4" height="7" fill="#333">
                          <animateTransform  attributeType="xml"
                            attributeName="transform" type="scale"
                            values="1,1; 1,3; 1,1"
                            begin="0.2s" dur="0.6s" repeatCount="indefinite" />       
                        </rect>
                        <rect x="20" y="0" width="4" height="7" fill="#333">
                          <animateTransform  attributeType="xml"
                            attributeName="transform" type="scale"
                            values="1,1; 1,3; 1,1"
                            begin="0.4s" dur="0.6s" repeatCount="indefinite" />       
                        </rect>
                      </svg>`;
            case 'five' :
                return `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                 width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                <rect x="0" y="0" width="4" height="10" fill="#333">
                  <animateTransform attributeType="xml"
                    attributeName="transform" type="translate"
                    values="0 0; 0 20; 0 0"
                    begin="0" dur="0.6s" repeatCount="indefinite" />
                </rect>
                <rect x="10" y="0" width="4" height="10" fill="#333">
                  <animateTransform attributeType="xml"
                    attributeName="transform" type="translate"
                    values="0 0; 0 20; 0 0"
                    begin="0.2s" dur="0.6s" repeatCount="indefinite" />
                </rect>
                <rect x="20" y="0" width="4" height="10" fill="#333">
                  <animateTransform attributeType="xml"
                    attributeName="transform" type="translate"
                    values="0 0; 0 20; 0 0"
                    begin="0.4s" dur="0.6s" repeatCount="indefinite" />
                </rect>
              </svg>`;
            case 'six' :
                return `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                     width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                    <rect x="0" y="13" width="4" height="5" fill="#333">
                      <animate attributeName="height" attributeType="XML"
                        values="5;21;5" 
                        begin="0s" dur="0.6s" repeatCount="indefinite" />
                      <animate attributeName="y" attributeType="XML"
                        values="13; 5; 13"
                        begin="0s" dur="0.6s" repeatCount="indefinite" />
                    </rect>
                    <rect x="10" y="13" width="4" height="5" fill="#333">
                      <animate attributeName="height" attributeType="XML"
                        values="5;21;5" 
                        begin="0.15s" dur="0.6s" repeatCount="indefinite" />
                      <animate attributeName="y" attributeType="XML"
                        values="13; 5; 13"
                        begin="0.15s" dur="0.6s" repeatCount="indefinite" />
                    </rect>
                    <rect x="20" y="13" width="4" height="5" fill="#333">
                      <animate attributeName="height" attributeType="XML"
                        values="5;21;5" 
                        begin="0.3s" dur="0.6s" repeatCount="indefinite" />
                      <animate attributeName="y" attributeType="XML"
                        values="13; 5; 13"
                        begin="0.3s" dur="0.6s" repeatCount="indefinite" />
                    </rect>
                  </svg>`;
            case 'seven' :
                return `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                 width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                <rect x="0" y="0" width="4" height="20" fill="#333">
                  <animate attributeName="opacity" attributeType="XML"
                    values="1; .2; 1" 
                    begin="0s" dur="0.6s" repeatCount="indefinite" />
                </rect>
                <rect x="7" y="0" width="4" height="20" fill="#333">
                  <animate attributeName="opacity" attributeType="XML"
                    values="1; .2; 1" 
                    begin="0.2s" dur="0.6s" repeatCount="indefinite" />
                </rect>
                <rect x="14" y="0" width="4" height="20" fill="#333">
                  <animate attributeName="opacity" attributeType="XML"
                    values="1; .2; 1" 
                    begin="0.4s" dur="0.6s" repeatCount="indefinite" />
                </rect>
              </svg>`;
            case 'eight' :
                return `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                 width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                <rect x="0" y="10" width="4" height="10" fill="#333" opacity="0.2">
                  <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0s" dur="0.6s" repeatCount="indefinite" />
                  <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
                  <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
                </rect>
                <rect x="8" y="10" width="4" height="10" fill="#333"  opacity="0.2">
                  <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
                  <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
                  <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
                </rect>
                <rect x="16" y="10" width="4" height="10" fill="#333"  opacity="0.2">
                  <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
                  <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
                  <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
                </rect>
              </svg>`;
        }
    }

});
