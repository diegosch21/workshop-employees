// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    /* ---------------------------------- Local Variables ---------------------------------- */
    var homeTpl = Handlebars.compile($("#home-tpl").html());    //homeTpl() ejecuta el template: lo evalua y obtiene el HTML
    var employeeLiTpl = Handlebars.compile($("#employee-li-tpl").html());   //Lista de empleados - employeeLiTpl(datos) ejecuta el template: obtiene el HTML procesando los datos
    var employeeTpl = Handlebars.compile($("#employee-tpl").html());    //Detalle de empleado. employeeTpl(datos) evalua y obtiene el HTML procesado

    var detailsURL = /^#employees\/(\d{1,})/; //regular expression to match employee details URLs
    
    var slider = new PageSlider($('body'));
    
    var adapter = new LocalStorageAdapter();
    adapter.initialize().done(function () {
        route();
    /*  MOVIDO A ROUTE():
        var view = new HomeView(adapter, homeTpl, employeeLiTpl);
        $('body').html(view.render().el);
    */
    });

    

    /* --------------------------------- Event Registration -------------------------------- */
    //$('.help-btn').on('click', function() {
    //    alert("Some help here...")
    //});

    $(window).on('hashchange', route);

    document.addEventListener('deviceready', function () {
        
        FastClick.attach(document.body);

        if (navigator.notification) { // Override default HTML alert with native dialog
            window.alert = function (message) {
                navigator.notification.alert(
                    message,    // message
                    null,       // callback
                    "Workshop", // title
                    'OK'        // buttonName
                );
            };
        }
    }, false);


    /* ---------------------------------- Local Functions ---------------------------------- */
    function route() {
        var hash = window.location.hash;
        if (!hash) {
            //$('body').html(new HomeView(adapter, homeTpl, employeeLiTpl).render().el);
            slider.slidePage(new HomeView(adapter, homeTpl, employeeLiTpl).render().el);
            return;
        }
        var match = hash.match(detailsURL);
        if (match) {
            adapter.findById(Number(match[1])).done(function(employee) {
                //$('body').html(new EmployeeView(adapter, employeeTpl, employee).render().el);
                slider.slidePage(new EmployeeView(adapter, employeeTpl, employee).render().el);
            });
        }
    }

 /*
    MOVIDAS A HOMEVIEW.JS

   function findByName() {
        adapter.findByName($('.search-key').val()).done(function (employees) {
            console.log(employees);
            $('.employee-list').html(employeeLiTpl(employees));
        });
    }

    function renderHomeView() {
        $('body').html(homeTpl());
        $('.search-key').on('keyup', findByName);
    }
*/
}());