(() => {
    ko.components.register('hrm-main-sidebar', {
        viewModel: {
            createViewModel: function (params, componentInfo) {
                const $element = $(componentInfo.element);
                $element.addClass(['hrm-main-sidebar']);

                return new (class {
                    constructor() {
                        this._isCollapsed = hrmExtractComponentParam(params, 'collapsed', false);
                        this._isUserSelected = false;
                        this._isNotificationsSelected = false;
                        this._selectedMenuItemIndex = null;
                        this._selectedDrawerContentName = null;
                        this._$element = $element;
                        this._$collapseToggleElement = this._$element.find('.hrm-main-sidebar__collapse-toggle');
                        this._$user = this._$element.find('.hrm-main-sidebar__user');
                        this._$notifications = this._$element.find('.hrm-main-sidebar__notifications');
                        this._$menuItems = this._$element.find('.hrm-main-sidebar__menu-item');
                        this._$drawer = this._$element.find('.hrm-main-sidebar__drawer');
                        this._$backdrop = this._$element.find('.hrm-main-sidebar__backdrop');

                        this._drawerContents = new Map(
                            this._$element.find('.hrm-main-sidebar__drawer-content')
                                .toArray()
                                .map(element => {
                                    const $element = $(element);
                                    return [$element.data('hrm-main-sidebar-drawer-content-name'), $element];
                                })
                        );

                        this.viewportSize = ko.observable({width: $(window).width(), height: $(window).height()});

                        this._init();
                    }

                    _init() {
                        this._$element.addClass('hrm-notransition');

                        this._$element.find('.hrm-main-sidebar__user').on('click', async () => {
                            if (this._isUserSelected) {
                                this.clearSelection();
                            } else {
                                this.selectUser();
                            }
                        });

                        this._$element.find('.hrm-main-sidebar__notifications').on('click', async () => {
                            if (this._isNotificationsSelected) {
                                this.clearSelection();
                            } else {
                                this.selectNotifications();
                            }
                        });
                        
                        this._$backdrop.on('click', async () => {
                            this.clearSelection();
                        });

                        this._$menuItems.each((index, menuItem) => {
                            $(menuItem).on('click', () => {
                                if (this._selectedMenuItemIndex === index) {
                                    this.clearSelection();
                                } else {
                                    this.selectMenuItem(index);
                                }
                            });
                        });

                        $(window).on('resize', () => {
                            this.viewportSize({width: $(window).width(), height: $(window).height()});
                        });

                        this._$element.toggleClass('hrm-main-sidebar--collapsed', this._isCollapsed());
                        this._isCollapsed.subscribe(collapsed => {
                            this._$element.toggleClass('hrm-main-sidebar--collapsed', collapsed);
                        });

                        setTimeout(() => {
                            this._$element.removeClass('hrm-notransition');
                        }, 0);

                        this.viewportSize.subscribe(() => {
                            this._$element.addClass('hrm-notransition');

                            setTimeout(() => {
                                this._$element.removeClass('hrm-notransition');
                            }, 0);
                        })
                    }

                    async selectUser() {
                        if (!this._isUserSelected) {
                            await this.clearSelection();

                            this._$user.addClass('hrm-main-sidebar__user--active');
                            this._isUserSelected = true;
                            await this._openDrawer('user');
                        }
                    }

                    async selectNotifications() {
                        if (!this._isNotificationsSelected) {
                            await this.clearSelection();

                            this._$notifications.addClass('hrm-main-sidebar__notifications--active');
                            this._isNotificationsSelected = true;
                            await this._openDrawer('notifications');
                        }
                    }

                    async selectMenuItem(index) {
                        if (this._selectedMenuItemIndex !== index) {
                            await this.clearSelection();

                            this._$menuItems.eq(index).addClass('hrm-main-sidebar__menu-item--active');
                            this._selectedMenuItemIndex = index;
                            this._isUserSelected = false;
                            await this._openDrawer(this._$menuItems.eq(index).data('hrm-main-sidebar-drawer-content-name'));
                        }
                    }

                    async clearSelection() {
                        if (this._selectedMenuItemIndex !== null) {
                            this._$menuItems.eq(this._selectedMenuItemIndex).removeClass('hrm-main-sidebar__menu-item--active');
                            this._selectedMenuItemIndex = null;
                        } else if (this._isUserSelected) {
                            this._$user.removeClass('hrm-main-sidebar__user--active');
                            this._isUserSelected = false;
                        } else if (this._isNotificationsSelected) {
                            this._$notifications.removeClass('hrm-main-sidebar__notifications--active');
                            this._isNotificationsSelected = false;
                        }

                        await this._closeDrawer();
                    }

                    async _openDrawer(contentName) {
                        if (this._selectedDrawerContentName !== contentName) {
                            await this._closeDrawer();

                            const $drawerContent = this._drawerContents.get(contentName);

                            $drawerContent.addClass('hrm-main-sidebar__drawer-content--active');
                            this._$drawer.addClass('hrm-main-sidebar__drawer--open');
                            this._$backdrop.addClass('hrm-main-sidebar__backdrop--visible');

                            if ($drawerContent.data('hrm-main-sidebar-drawer-class') !== undefined) {
                                this._$drawer.addClass($drawerContent.data('hrm-main-sidebar-drawer-class'));
                            }

                            this._selectedDrawerContentName = contentName;
                        }
                    }

                    async _closeDrawer() {
                        if (this._selectedDrawerContentName !== null) {
                            this._$drawer.removeClass('hrm-main-sidebar__drawer--open');
                            this._$backdrop.removeClass('hrm-main-sidebar__backdrop--visible');

                            await new Promise(resolve => setTimeout(resolve, 200));

                            const $drawerContent = this._drawerContents.get(this._selectedDrawerContentName);

                            this._$drawer.removeClass($drawerContent.data('hrm-main-sidebar-drawer-class'));

                            $drawerContent.removeClass('hrm-main-sidebar__drawer-content--active');

                            this._selectedDrawerContentName = null;
                        }
                    }
                });
            }
        },
        template: `
            <div class="hrm-main-sidebar__content-wrapper">
                <div class="hrm-main-sidebar__content">
                    <div class="hrm-main-sidebar__header">
                        <div class="hrm-main-sidebar__user">
                            <!--<img class="hrm-main-sidebar__avatar" src="assets/examples/avatar.jpg">-->
                            <img class="hrm-main-sidebar__avatar" src="assets/img/avatar-placeholder.png">
        
                            <div class="hrm-main-sidebar__user-name">
                                Пётр Петров
                            </div>
                        </div>
        
                        <div class="hrm-main-sidebar__notifications">
                            <div class="hrm-main-sidebar__notifications-icon">
                                <div class="hrm-main-sidebar__notifications-icon-counter">28</div>
                            </div>
                        </div>
                    </div>
        
                    <ul class="nav hrm-main-sidebar__menu">
                        <li class="hrm-main-sidebar__menu-item hrm-main-sidebar__menu-calculations-item"
                            data-hrm-main-sidebar-drawer-content-name="calculations">
                            <span class="hrm-main-sidebar__menu-item-name">Расчёты</span>
                        </li>
        
                        <li class="hrm-main-sidebar__menu-item hrm-main-sidebar__menu-hr-item"
                            data-hrm-main-sidebar-drawer-content-name="hr">
                            <span class="hrm-main-sidebar__menu-item-name">Кадры</span>
                        </li>
        
                        <li class="hrm-main-sidebar__menu-item hrm-main-sidebar__menu-documents-item"
                            data-hrm-main-sidebar-drawer-content-name="documents">
                            <span class="hrm-main-sidebar__menu-item-name">Отчёты</span>
                        </li>
        
                        <li class="hrm-main-sidebar__menu-item hrm-main-sidebar__menu-reference-item"
                            data-hrm-main-sidebar-drawer-content-name="reference">
                            <span class="hrm-main-sidebar__menu-item-name">Справочники</span>
                        </li>
        
                        <li class="hrm-main-sidebar__menu-item hrm-main-sidebar__menu-contents-item"
                            data-hrm-main-sidebar-drawer-content-name="contents">
                            <span class="hrm-main-sidebar__menu-item-name">Все разделы</span>
                        </li>
                    </ul>
        
                    <div class="hrm-spacer"></div>
                    
                    <div class="hrm-main-sidebar__actions">
                        <a class="hrm-main-sidebar__settings-link" href="#" title="Настройки"></a>
        
                        <a class="hrm-main-sidebar__support-link" href="#" title="Помощь"></a>
            
                        <button class="hrm-button hrm-main-sidebar__collapse-toggle"
                                data-bind="click: function() {_isCollapsed(!_isCollapsed());}">
                        </button>
                    </div>
                </div>
            </div>
        
            <div class="hrm-main-sidebar__drawer">
                <div class="hrm-main-sidebar__drawer-content-wrapper" 
                     data-bind="hrmScrollable, hrmScrollableDisabled: viewportSize().width <= HRM_BREAKPOINTS.tabletMaxWidth">
                    <div class="hrm-main-sidebar__drawer-content"
                         data-hrm-main-sidebar-drawer-content-name="calculations"
                         data-hrm-main-sidebar-drawer-class="hrm-main-sidebar__menu-base-drawer">
                         <!-- ko template: {name: 'hrm-main-sidebar-calculations-content'} --><!-- /ko -->
                    </div>
        
                    <div class="hrm-main-sidebar__drawer-content"
                         data-hrm-main-sidebar-drawer-content-name="hr"
                         data-hrm-main-sidebar-drawer-class="hrm-main-sidebar__menu-base-drawer">
                         <!-- ko template: {name: 'hrm-main-sidebar-hr-content'} --><!-- /ko -->
                    </div >
        
                    <div class="hrm-main-sidebar__drawer-content"
                         data-hrm-main-sidebar-drawer-content-name="documents"
                         data-hrm-main-sidebar-drawer-class="hrm-main-sidebar__menu-base-drawer">
                         <!-- ko template: {name: 'hrm-main-sidebar-documents-content'} --><!-- /ko -->
                    </div>
        
                    <div class="hrm-main-sidebar__drawer-content"
                         data-hrm-main-sidebar-drawer-content-name="reference"
                         data-hrm-main-sidebar-drawer-class="hrm-main-sidebar__menu-base-drawer">
                         <!-- ko template: {name: 'hrm-main-sidebar-reference-content'} --><!-- /ko -->
                    </div>
                    
                    <div class="hrm-main-sidebar__drawer-content"
                         data-hrm-main-sidebar-drawer-content-name="contents"
                         data-hrm-main-sidebar-drawer-class="hrm-main-sidebar__contents-drawer">
                         <!-- ko template: {name: 'hrm-main-sidebar-contents-content'} --><!-- /ko -->
                    </div>
                    
                    <div class="hrm-main-sidebar__drawer-content"
                         data-hrm-main-sidebar-drawer-content-name="user">
                         <!-- ko template: {name: 'hrm-main-sidebar-user-content'} --><!-- /ko -->
                    </div>
                    
                    <div class="hrm-main-sidebar__drawer-content"
                         data-hrm-main-sidebar-drawer-content-name="notifications">
                         <!-- ko template: {name: 'hrm-main-sidebar-notifications-content'} --><!-- /ko -->
                    </div>
                </div>
            </div>
        
            <div class="hrm-main-sidebar__backdrop"></div>
            
            <script id="hrm-main-sidebar-calculations-content" type="text/html">
                <div class="hrm-main-sidebar__submenu">
                    <a class="hrm-main-sidebar__submenu-item" href="#">Сотрудники</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Штатная численность</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Потребность в персонале</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Кандидаты</a>
                    <a class="hrm-main-sidebar__submenu-item hrm-main-sidebar__submenu-item--active" href="#">Жалобы и предложения</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Приказы/инструкции</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Анкеты водителей</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Праздничные надбавки</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Надбавки за лучшие показатели</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Договоры</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Управление уведомлениями</a>
                </div>
            </script>
            
            <script id="hrm-main-sidebar-hr-content" type="text/html">
                <div class="hrm-main-sidebar__submenu">
                    <a class="hrm-main-sidebar__submenu-item" href="#">Сотрудники</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Штатная численность</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Потребность в персонале</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Кандидаты</a>
                    <a class="hrm-main-sidebar__submenu-item hrm-main-sidebar__submenu-item--active" href="#">Жалобы и предложения</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Приказы/инструкции</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Анкеты водителей</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Праздничные надбавки</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Надбавки за лучшие показатели</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Договоры</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Управление уведомлениями</a>
                </div>
            </script>
            
            <script id="hrm-main-sidebar-documents-content" type="text/html">
                <div class="hrm-main-sidebar__submenu">
                    <a class="hrm-main-sidebar__submenu-item" href="#">Сотрудники</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Штатная численность</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Потребность в персонале</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Кандидаты</a>
                    <a class="hrm-main-sidebar__submenu-item hrm-main-sidebar__submenu-item--active" href="#">Жалобы и предложения</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Приказы/инструкции</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Анкеты водителей</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Праздничные надбавки</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Надбавки за лучшие показатели</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Договоры</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Управление уведомлениями</a>
                </div>
            </script>
            
            <script id="hrm-main-sidebar-reference-content" type="text/html">
                <div class="hrm-main-sidebar__submenu">
                    <a class="hrm-main-sidebar__submenu-item" href="#">Сотрудники</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Штатная численность</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Потребность в персонале</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Кандидаты</a>
                    <a class="hrm-main-sidebar__submenu-item hrm-main-sidebar__submenu-item--active" href="#">Жалобы и предложения</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Приказы/инструкции</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Анкеты водителей</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Праздничные надбавки</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Надбавки за лучшие показатели</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Договоры</a>
                    <a class="hrm-main-sidebar__submenu-item" href="#">Управление уведомлениями</a>
                </div>
            </script>
            
            <script id="hrm-main-sidebar-user-content" type="text/html">
                Пользователь
            </script>
            
            <script id="hrm-main-sidebar-notifications-content" type="text/html">
                Уведомления
            </script>
            
            <script id="hrm-main-sidebar-contents-content" type="text/html">
                <!-- ko if: viewportSize().width > HRM_BREAKPOINTS.mobileMaxWidth -->
                    Все разделы
                <!-- /ko -->
                
                <!-- ko if: viewportSize().width <= HRM_BREAKPOINTS.mobileMaxWidth -->
                    <div class="hrm-main-sidebar__contents">
                        <!-- ko let: {isOpen: ko.observable(false)} -->
                            <div class="hrm-main-sidebar__contents-section"
                                 data-bind="css: {'hrm-main-sidebar__contents-section--open': isOpen}">
                                <div class="hrm-main-sidebar__contents-section-header"
                                     data-bind="click: function() {isOpen(!isOpen());}">
                                    Расчеты
                                </div>
                                <div class="hrm-main-sidebar__contents-section-body"
                                     data-bind="hrmSlide, hrmSlideValue: isOpen">
                                    <!-- ko template: {name: 'hrm-main-sidebar-calculations-content'} --><!-- /ko -->
                                </div>
                            </div>
                        <!-- /ko -->
                        <!-- ko let: {isOpen: ko.observable(false)} -->
                            <div class="hrm-main-sidebar__contents-section"
                                 data-bind="css: {'hrm-main-sidebar__contents-section--open': isOpen}">
                                <div class="hrm-main-sidebar__contents-section-header"
                                     data-bind="click: function() {isOpen(!isOpen());}">
                                    Кадры
                                </div>
                                <div class="hrm-main-sidebar__contents-section-body"
                                     data-bind="hrmSlide, hrmSlideValue: isOpen">
                                    <!-- ko template: {name: 'hrm-main-sidebar-hr-content'} --><!-- /ko -->
                                </div>
                            </div>
                        <!-- /ko -->
                        <!-- ko let: {isOpen: ko.observable(false)} -->
                            <div class="hrm-main-sidebar__contents-section"
                                 data-bind="css: {'hrm-main-sidebar__contents-section--open': isOpen}">
                                <div class="hrm-main-sidebar__contents-section-header"
                                     data-bind="click: function() {isOpen(!isOpen());}">
                                    Документы
                                </div>
                                <div class="hrm-main-sidebar__contents-section-body"
                                     data-bind="hrmSlide, hrmSlideValue: isOpen">
                                    <!-- ko template: {name: 'hrm-main-sidebar-documents-content'} --><!-- /ko -->
                                </div>
                            </div>
                        <!-- /ko -->
                        <!-- ko let: {isOpen: ko.observable(false)} -->
                            <div class="hrm-main-sidebar__contents-section"
                                 data-bind="css: {'hrm-main-sidebar__contents-section--open': isOpen}">
                                <div class="hrm-main-sidebar__contents-section-header"
                                     data-bind="click: function() {isOpen(!isOpen());}">
                                    Справочники
                                </div>
                                <div class="hrm-main-sidebar__contents-section-body"
                                     data-bind="hrmSlide, hrmSlideValue: isOpen">
                                    <!-- ko template: {name: 'hrm-main-sidebar-reference-content'} --><!-- /ko -->
                                </div>
                            </div>
                        <!-- /ko -->
                        <!-- ko let: {isOpen: ko.observable(false)} -->
                            <div class="hrm-main-sidebar__contents-section"
                                 data-bind="css: {'hrm-main-sidebar__contents-section--open': isOpen}">
                                <div class="hrm-main-sidebar__contents-section-header"
                                     data-bind="click: function() {isOpen(!isOpen());}">
                                    Графики
                                </div>
                                <div class="hrm-main-sidebar__contents-section-body"
                                     data-bind="hrmSlide, hrmSlideValue: isOpen">
                                    <!-- ko template: {name: 'hrm-main-sidebar-calculations-content'} --><!-- /ko -->
                                </div>
                            </div>
                        <!-- /ko -->
                        <!-- ko let: {isOpen: ko.observable(false)} -->
                            <div class="hrm-main-sidebar__contents-section"
                                 data-bind="css: {'hrm-main-sidebar__contents-section--open': isOpen}">
                                <div class="hrm-main-sidebar__contents-section-header"
                                     data-bind="click: function() {isOpen(!isOpen());}">
                                    Листовки
                                </div>
                                <div class="hrm-main-sidebar__contents-section-body"
                                     data-bind="hrmSlide, hrmSlideValue: isOpen">
                                    <!-- ko template: {name: 'hrm-main-sidebar-calculations-content'} --><!-- /ko -->
                                </div>
                            </div>
                        <!-- /ko -->
                        <!-- ko let: {isOpen: ko.observable(false)} -->
                            <div class="hrm-main-sidebar__contents-section"
                                 data-bind="css: {'hrm-main-sidebar__contents-section--open': isOpen}">
                                <div class="hrm-main-sidebar__contents-section-header"
                                     data-bind="click: function() {isOpen(!isOpen());}">
                                    Маркетинг
                                </div>
                                <div class="hrm-main-sidebar__contents-section-body"
                                     data-bind="hrmSlide, hrmSlideValue: isOpen">
                                    <!-- ko template: {name: 'hrm-main-sidebar-calculations-content'} --><!-- /ko -->
                                </div>
                            </div>
                        <!-- /ko -->
                        <!-- ko let: {isOpen: ko.observable(false)} -->
                            <div class="hrm-main-sidebar__contents-section"
                                 data-bind="css: {'hrm-main-sidebar__contents-section--open': isOpen}">
                                <div class="hrm-main-sidebar__contents-section-header"
                                     data-bind="click: function() {isOpen(!isOpen());}">
                                    Штрафы/Премии
                                </div>
                                <div class="hrm-main-sidebar__contents-section-body"
                                     data-bind="hrmSlide, hrmSlideValue: isOpen">
                                    <!-- ko template: {name: 'hrm-main-sidebar-calculations-content'} --><!-- /ko -->
                                </div>
                            </div>
                        <!-- /ko -->
                        <!-- ko let: {isOpen: ko.observable(false)} -->
                            <div class="hrm-main-sidebar__contents-section"
                                 data-bind="css: {'hrm-main-sidebar__contents-section--open': isOpen}">
                                <div class="hrm-main-sidebar__contents-section-header"
                                     data-bind="click: function() {isOpen(!isOpen());}">
                                    Нарушения
                                </div>
                                <div class="hrm-main-sidebar__contents-section-body"
                                     data-bind="hrmSlide, hrmSlideValue: isOpen">
                                    <!-- ko template: {name: 'hrm-main-sidebar-calculations-content'} --><!-- /ko -->
                                </div>
                            </div>
                        <!-- /ko -->
                        <!-- ko let: {isOpen: ko.observable(false)} -->
                            <div class="hrm-main-sidebar__contents-section"
                                 data-bind="css: {'hrm-main-sidebar__contents-section--open': isOpen}">
                                <div class="hrm-main-sidebar__contents-section-header"
                                     data-bind="click: function() {isOpen(!isOpen());}">
                                    Плохие отзывы
                                </div>
                                <div class="hrm-main-sidebar__contents-section-body"
                                     data-bind="hrmSlide, hrmSlideValue: isOpen">
                                    <!-- ko template: {name: 'hrm-main-sidebar-calculations-content'} --><!-- /ko -->
                                </div>
                            </div>
                        <!-- /ko -->
                        <!-- ko let: {isOpen: ko.observable(false)} -->
                            <div class="hrm-main-sidebar__contents-section"
                                 data-bind="css: {'hrm-main-sidebar__contents-section--open': isOpen}">
                                <div class="hrm-main-sidebar__contents-section-header"
                                     data-bind="click: function() {isOpen(!isOpen());}">
                                    Жалобы и предложения
                                </div>
                                <div class="hrm-main-sidebar__contents-section-body"
                                     data-bind="hrmSlide, hrmSlideValue: isOpen">
                                    <!-- ko template: {name: 'hrm-main-sidebar-calculations-content'} --><!-- /ko -->
                                </div>
                            </div>
                        <!-- /ko -->
                        <!-- ko let: {isOpen: ko.observable(false)} -->
                            <div class="hrm-main-sidebar__contents-section"
                                 data-bind="css: {'hrm-main-sidebar__contents-section--open': isOpen}">
                                <div class="hrm-main-sidebar__contents-section-header"
                                     data-bind="click: function() {isOpen(!isOpen());}">
                                    Зоны доставки
                                </div>
                                <div class="hrm-main-sidebar__contents-section-body"
                                     data-bind="hrmSlide, hrmSlideValue: isOpen">
                                    <!-- ko template: {name: 'hrm-main-sidebar-calculations-content'} --><!-- /ko -->
                                </div>
                            </div>
                        <!-- /ko -->
                        <!-- ko let: {isOpen: ko.observable(false)} -->
                            <div class="hrm-main-sidebar__contents-section"
                                 data-bind="css: {'hrm-main-sidebar__contents-section--open': isOpen}">
                                <div class="hrm-main-sidebar__contents-section-header"
                                     data-bind="click: function() {isOpen(!isOpen());}">
                                    Инструкции
                                </div>
                                <div class="hrm-main-sidebar__contents-section-body"
                                     data-bind="hrmSlide, hrmSlideValue: isOpen">
                                    <!-- ko template: {name: 'hrm-main-sidebar-calculations-content'} --><!-- /ko -->
                                </div>
                            </div>
                        <!-- /ko -->
                        <!-- ko let: {isOpen: ko.observable(false)} -->
                            <div class="hrm-main-sidebar__contents-section"
                                 data-bind="css: {'hrm-main-sidebar__contents-section--open': isOpen}">
                                <div class="hrm-main-sidebar__contents-section-header"
                                     data-bind="click: function() {isOpen(!isOpen());}">
                                    Календарь событий
                                </div>
                                <div class="hrm-main-sidebar__contents-section-body"
                                     data-bind="hrmSlide, hrmSlideValue: isOpen">
                                    <!-- ko template: {name: 'hrm-main-sidebar-calculations-content'} --><!-- /ko -->
                                </div>
                            </div>
                        <!-- /ko -->
                    </div>
                <!-- /ko -->
            </script>
        `
    });
})();
