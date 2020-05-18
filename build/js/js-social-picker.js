const SOCIAL_TYPE_FB = 0;
const SOCIAL_TYPE_INST = 1;
const SOCIAL_TYPE_LN = 2;
const SOCIAL_TYPE_OK = 3;
const SOCIAL_TYPE_TT = 4;
const SOCIAL_TYPE_VK = 5;
const SOCIAL_TYPE_YT = 6;

/** Компонент добавления социальных сетей. */
ko.components.register('social-picker', {
    viewModel: {
        createViewModel: function (params, componentInfo) {
            const $element = $(componentInfo.element);

            $element.addClass(['social-picker']);

            return new (function () {
                this.value = params.value;

                this.mode = ko.observable('view');

                this.addingForm = ko.observable('');

                this.editingForm = ko.observableArray([]);

                this.editingFormRemoveItem = function(item) {
                    this.editingForm.remove(item);
                };

                this.openEditingForm = function () {
                    this.mode('editing');
                    this.editingForm(this.value().map(url => ({url: ko.observable(url)})));
                };

                this.cancelEditingForm = function () {
                    this.mode('view');
                };

                this.submitEditingForm = function () {
                    this.mode('view');
                    this.value(this.editingForm().map(({url}) => url()));
                };

                this.isEditingFormValid = ko.pureComputed(() => {
                    return this.editingForm().every(({url}) => {
                        return this.getSocialTypeByUrl(url()) !== null;
                    });
                });

                this.openAddingForm = function () {
                    this.mode('adding');
                    this.addingForm('');
                };

                this.submitAddingForm = function () {
                    this.mode('view');
                    this.value.push(this.addingForm());
                };

                this.viewClass = ko.pureComputed(() => {
                    const classNames = ['social-picker__view'];

                    if (this.value().length === 0) {
                        classNames.push('social-picker__view--empty');
                    }

                    return classNames.join(' ');
                });

                this.getSocialTypeLogoUrl = function(socialType) {
                    switch (socialType) {
                        case SOCIAL_TYPE_FB: return '/images/social/fb.svg';
                        case SOCIAL_TYPE_INST: return '/images/social/inst.svg';
                        case SOCIAL_TYPE_LN: return '/images/social/ln.svg';
                        case SOCIAL_TYPE_OK: return '/images/social/ok.svg';
                        case SOCIAL_TYPE_TT: return '/images/social/tt.svg';
                        case SOCIAL_TYPE_VK: return '/images/social/vk.svg';
                        case SOCIAL_TYPE_YT: return '/images/social/yt.svg';
                    }
                };

                this.getSocialTypeByUrl = function (url) {
                    if (url === '') {
                        return null;
                    }

                    try {
                        let hostname = new URL(url).hostname;

                        if (hostname.startsWith('www.')) {
                            hostname = hostname.slice(4);
                        }

                        switch (hostname) {
                            case 'vk.com': return SOCIAL_TYPE_VK;
                            case 'facebook.com': return SOCIAL_TYPE_FB;
                            case 'ok.ru': return SOCIAL_TYPE_OK;
                            case 'linkedin.com': return SOCIAL_TYPE_LN;
                            case 'instagram.com': return SOCIAL_TYPE_INST;
                            case 'tiktok.com': return SOCIAL_TYPE_TT;
                            case 'youtube.com': return SOCIAL_TYPE_YT;
                            default: return null;
                        }
                    } catch (error) {
                        return null;
                    }
                }
            });
        }
    },
    template: `
        <div class="social-picker__header">Соцсети</div>
        
        <!-- ko foreach: {
            data: templateIf(mode() === 'view', $data),
            beforeRemove: slideBeforeRemoveFactory(200),
            afterAdd: slideAfterAddFactory(200, 200)
        } -->
            <div data-bind="class: viewClass">
                <!-- ko foreach: {
                    data: templateIf(value().length === 0, $data),
                    beforeRemove: fadeBeforeRemoveFactory(200),
                    afterAdd: fadeAfterAddFactory(200, 200)
                } -->
                    <div class="social-picker__view-placeholder">Можно ввести соцсети: Facebook, VK, Одноклассники, Linkedin, Инстаграмм, Тикток, Ютуб</div>
                    
                    <div class="social-picker__view-actions">
                        <button class="btn btn-success social-picker__view-action" type="button"
                                data-bind="click: function () {$component.openAddingForm();}">
                            Добавить
                        </button>
                    </div>
                <!-- /ko -->
                
                <!-- ko foreach: {
                    data: templateIf(value().length > 0, $data),
                    beforeRemove: fadeBeforeRemoveFactory(200),
                    afterAdd: fadeAfterAddFactory(200, 200)
                } -->
                    <div class="social-picker__view-list">
                        <!-- ko foreach: value -->
                            <a class="social-picker__social-type-logo social-picker__view-list-item" data-bind="
                                style: {'background-image': 'url(' + $component.getSocialTypeLogoUrl($component.getSocialTypeByUrl($data)) +  ')'},
                                attr: {href: $data}
                            " target="_blank">
                            </a>
                        <!-- /ko -->
                    </div>
                    
                    <div class="social-picker__view-actions">
                        <button class="btn btn-default icon-btn social-picker__view-action visible-sm visible-md visible-lg" type="button"
                                data-bind="click: function () {$component.openEditingForm();}">
                            <i class="fas fa-pencil"></i>
                        </button>
                        
                        <button class="btn btn-default social-picker__view-action visible-xs" type="button"
                                data-bind="click: function () {$component.openEditingForm();}">
                            Редактировать
                        </button>
                    
                        <button class="btn btn-success social-picker__view-action social-picker__view-add-button" type="button"
                                data-bind="click: function () {$component.openAddingForm();}">
                            Добавить
                        </button>
                    </div>
                <!-- /ko -->
            </div>
        <!-- /ko -->
        
        <!-- ko foreach: {
            data: templateIf(mode() === 'adding', $data),
            beforeRemove: slideBeforeRemoveFactory(200),
            afterAdd: slideAfterAddFactory(200, 200)
        } -->
            <div class="social-picker__adding-form">
                <!-- ko let: {socialType: $component.getSocialTypeByUrl(addingForm())} -->
                    <!-- ko let: {invalid: addingForm() !== '' && socialType === null} -->
                        <div class="social-picker__control social-picker__adding-form-control">
                            <!-- ko if: addingForm() !== '' -->
                                <!-- ko if: socialType !== null -->
                                    <a class="social-picker__social-type-logo" data-bind="
                                        style: {'background-image': 'url(' + $component.getSocialTypeLogoUrl(socialType) +  ')'},
                                        attr: {href: addingForm()}
                                    " target="_blank">
                                    </a>
                                <!-- /ko -->
                                
                                <!-- ko if: socialType === null -->
                                    <div class="social-picker__control-status social-picker__control-error-indicator">
                                        <i class="fas fa-frown social-picker__control-error-indicator-icon"></i>
                                    </div>
                                <!-- /ko -->
                            <!-- /ko -->
                            
                            <!-- ko if: addingForm() === '' -->
                                <div class="social-picker__control-status"></div>
                            <!-- /ko -->
                            
                            <div class="form-group social-picker__control-form-group"
                                 data-bind="css: {'has-error': invalid}">
                                <input class="form-control" data-bind="textInput: addingForm">                            
                                
                                <!-- ko foreach: {
                                    data: templateIf(invalid, $data),
                                    beforeRemove: slideBeforeRemoveFactory(200),
                                    afterAdd: slideAfterAddFactory(200)
                                } -->
                                    <div class="help-block">
                                      Неправильная ссылка. Можно ввести соцсети: Facebook, VK, Одноклассники, Linkedin, Инстаграмм, Тикток, Ютуб
                                    </div>
                                <!-- /ko -->
                            </div>
                        </div>
                        
                        <div class="social-picker__adding-form-actions">
                            <button class="btn btn-default social-picker__adding-form-action" type="button"
                                    data-bind="click: function () {$component.mode('view');}">
                                Отменить
                            </button>
                            
                            <button class="btn btn-success social-picker__adding-form-action" type="button"
                                    data-bind="click: function () {$component.submitAddingForm();}, attr: {disabled: addingForm() === '' || invalid}">
                                Сохранить
                            </button>
                        </div>
                    <!-- /ko -->
                <!-- /ko -->
            </div>
        <!-- /ko -->
        
        <!-- ko foreach: {
            data: templateIf(mode() === 'editing', $data),
            beforeRemove: slideBeforeRemoveFactory(200),
            afterAdd: slideAfterAddFactory(200, 200)
        } -->
            <div class="social-picker__editing-form">    
                <div class="social-picker__editing-form-list">    
                    <!-- ko foreach: {
                        data: editingForm,
                        beforeRemove: slideBeforeRemoveFactory(200),
                        afterAdd: slideAfterAddFactory(200)
                    } -->
                        <div class="social-picker__editing-form-list-item">
                            <!-- ko let: {socialType: $component.getSocialTypeByUrl(url())} -->
                                <!-- ko let: {invalid: socialType === null} -->
                                    <div class="social-picker__control social-picker__editing-form-list-item-control">
                                        <!-- ko if: socialType !== null -->
                                            <a class="social-picker__social-type-logo" data-bind="
                                                style: {'background-image': 'url(' + $component.getSocialTypeLogoUrl(socialType) +  ')'},
                                                attr: {href: url()}
                                            " target="_blank">
                                            </a>
                                        <!-- /ko -->
                                        
                                        <!-- ko if: socialType === null -->
                                            <div class="social-picker__control-status social-picker__control-error-indicator">
                                                <i class="fas fa-frown social-picker__control-error-indicator-icon"></i>
                                            </div>
                                        <!-- /ko -->
                                        
                                        <div class="form-group social-picker__control-form-group"
                                             data-bind="css: {'has-error': invalid}">
                                            <input class="form-control" data-bind="textInput: url">                            
                                            
                                            <!-- ko foreach: {
                                                data: templateIf(invalid, $data),
                                                beforeRemove: slideBeforeRemoveFactory(200),
                                                afterAdd: slideAfterAddFactory(200)
                                            } -->
                                                <div class="help-block">
                                                  Неправильная ссылка. Можно ввести соцсети: Facebook, VK, Одноклассники, Linkedin, Инстаграмм, Тикток, Ютуб
                                                </div>
                                            <!-- /ko -->
                                        </div>
                                    </div>
                                <!-- /ko -->
                            <!-- /ko -->
                            
                            <button class="btn btn-danger icon-btn social-picker__editing-form-list-item-remove-button"
                                    data-bind="click: function() {$component.editingFormRemoveItem($data);}" type="button" title="Удалить">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    <!-- /ko -->
                </div>
                
                <div class="social-picker__editing-form-actions">
                    <button class="btn btn-default social-picker__editing-form-action" type="button"
                            data-bind="click: function () {$component.mode('view');}">
                        Отменить
                    </button>
                    
                    <button class="btn btn-success social-picker__editing-form-action" type="button"
                            data-bind="click: function () {$component.submitEditingForm();}, attr: {disabled: !isEditingFormValid()}">
                        Сохранить
                    </button>
                </div>
            </div>
        <!-- /ko -->
    `
});
