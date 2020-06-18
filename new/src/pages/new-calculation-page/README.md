## Position Model

Поле|Тип данных|Тип поля|Пояснение
-|-|-|-
id|string|статическое|Идентификатор
name|string|статическое|Имя
levels|array|статическое|Разряды
workload|number|observable|Нагрузка
workloadType|string|observable|Тип нагрузки
workloadUnits|string|from position data|Единица измерения
additionalWorkload|number|observable|Доп. нагрузка
additionalWorkloadType|string|статическое|Тип нагрузки
additionalWorkloadUnits|string|статическое|Единица измерения
fotCategory|number|observable|ФОТ, % в категории
fotRevenue|number|observable|ФОТ, % от выручки
salary|number|статическое|Оклад
salaryBulk|number|статическое|Основная часть зарплаты
revenueStandart|number|статическое|Норматив выручки
revenueStandartUnits|string|статическое|Единица измерения
revenueStandartPerHour|number|статическое|Норматив выручки в час
performanceStandart|number|статическое|Норматив выработки
performanceStandartUnits|string|статическое|Единица измерения
performanceStandartType|string|статическое|-
employees|array|observable|Массив сотрудников
allEmployeesLoaded|boolean|observable|Загружены сотрудники для всех филиалов
workingTime|number|computed|Рабочее время в минутах
lateness|object|computed|Опоздания
visible|boolean|observable|Отображается в таблице

## Employee Model

Поле|Тип данных|Тип поля|Пояснение
-|-|-|-
id|string|статическое|Идентификатор
name|string|статическое|Имя
link|string|статическое|Ссылка на личное дело
hasProblems|bool|статическое|Проблемы с документами
upRecommended|bool|observable|Рекомендуется повышение
downRecommended|bool|observable|Рекомендуется понижение
account|number|observable|Личный счет
premiumAccount|number|observable|Прем.аккаунт
accountState|number|computed|Операции с ЛС
accountOperations|array|observable|Массив операция
level|string/int|observable|Разряд
workingIntervals|array|observable|Массив интервалов
workingTime|number|computed|Рабочее время в минутах
compensation|number|observable|Компенс.
workload|number|observable|Нагрузка
workloadUnits|string|статическое|Единица измерения
salary|number|observable|Оклад
salaryBulk|number|observable|Осн.часть зп
revenueStandartUnits|string|статическое|Единица измерения
revenueStandartPerHour|number|observable|Норматив выручки в час
revenueStandart|number|статическое|Норматив выручки
normalizationRatio|number|статическое|Коэф.норм.
bonusRatio|number|статическое|Коэф.прем.
bonusExceed|number|observable|Прем.за превыш.норм.
correctedTime|string|observable|Корр. время
depremation|number|observable|Депр.
fines|array|observable|Массив штрафов
finesState|number|computed|Штраф
bonuses|array|observable|Массив премий
bonusesState|number|computed|Премия
total|number|observable|Всего начислено
toPayment|number|observable|К выплате
visible|boolean|observable|Участвует в расчете
