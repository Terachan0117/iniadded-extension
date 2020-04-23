function getHostname() {
    return location.hostname
}

function getPathname() {
    return location.pathname
}

function getSearch() {
    return location.search
}

// DOMツリー構築完了後実行
$(document).ready(function () {

    // ホストネームを取得し処理を分岐
    switch (getHostname()) {

        // INIAD MOOCs
        case "moocs.iniad.org":

            // コースページ
            if (getPathname().match(/^\/courses\/?(\d{4})?\/?$/)) {

                // クエリーパラメーターを取得し処理を分岐
                switch (getSearch()) {
                    
                    // ストレージクリア (デバック用)
                    case "?storageclear":
                        if (window.confirm("ローカルストレージの内容をすべて削除します。この操作は元に戻せません。本当によろしいですか？\n" +
                                "Delete all the contents of the local storage. This operation cannot be undone. Are you really sure?")) {
                            localStorage.clear();
                        }
                        location.href = "../courses";
                        break;
                    
                    default:

                        // コース年度 取得
                        const CURRENT_YEAR = $(".breadcrumb").text().substring(1);

                        // New Lectures ボタン表示
                        $('<a class="btn btn-primary btn-sm" href="?newlectures"><i class="fa fa-bell"></i> New Lectures <span id="newlectures_badge" class="badge text-primary"></span></a>')
                            .insertBefore(".breadcrumb");

                        // My Courses ボタン表示
                        $('<a class="btn btn-default btn-sm" href="?mycourses"><i class="fa fa-book"></i> My Courses</a>')
                            .insertBefore(".breadcrumb");

                        // INIADded バナー表示
                        $('<div style="position:absolute;width:310px;height:60px;right:0px;top:60px;"><iframe src="https://iniadded.tera-chan.com/baner.html?' +
                                new Date().getTime() +
                                '" scrolling="no" style="background-color:transparent;width:100%;height:100%;border:none;"></iframe></div>')
                            .appendTo("body");

                        // Open Drive ボタン表示 (userLang===ja時のみ)
                        $.ajax({
                            url: '../account',
                            cache: false,
                            datatype: 'html',
                            success: function (html) {
                                const userLang = $(html).find('#lang').val();
                                if (userLang === "ja") {
                                    $(".well").each(function () {
                                        let courseName = $(this).find(".media-heading").text();
                                        courseName = courseName.replace(/[\sIVXABⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ]/g, "");
                                        if (courseName.indexOf("（") != -1) {
                                            courseName = courseName.slice(0, courseName.indexOf("（"));
                                        }
                                        if (courseName.indexOf("(") != -1) {
                                            courseName = courseName.slice(0, courseName.indexOf("("));
                                        }
                                        if (courseName.indexOf("＆") != -1) {
                                            courseName = courseName.slice(0, courseName.indexOf("＆"));
                                        }
                                        if (courseName.indexOf("&") != -1) {
                                            courseName = courseName.slice(0, courseName.indexOf("&"));
                                        }
                                        const driveUrl = 'https://drive.google.com/drive/search?q=type:folder%20' +
                                            CURRENT_YEAR + '%20' +
                                            encodeURI(courseName) + '%20parent:1KyD2j3o1_IeK7Gum676Ssd0uKDiAybQJ';
                                        $('<a class="btn btn-default" href="' + driveUrl + '" target="_blank"><i class="fa fa-folder-open"></i> Open Drive</a>')
                                            .appendTo($(this).find(".media-body"));
                                    });
                                }
                            }
                        });

                }
            }
            break;

        default:
    }
});