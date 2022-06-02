<template>
  <v-menu
      ref="menuRef"
      v-model="menu"
      :close-on-content-click="false"
      max-width="380px"
      nudge-bottom="5"
      offset-y
  >
    <template #activator="{ on, attrs }">
      <div
          class="d-flex align-center"
          style="width: 100%"
      >
        <v-btn
            :disabled="isAllSelected"
            color="secondary"
            dark
            icon
            small
            @click="onPrevious"
        >
          <v-icon dark>
            mdi-chevron-left
          </v-icon>
        </v-btn>
        <v-text-field
            :value="labelToShow"
            append-icon="mdi-menu-down"
            class="centered-input"
            hide-details
            readonly
            solo
            v-bind="attrs"
            v-on="on"
            @click:append="menu = !menu"
        />
        <v-btn
            :disabled="isAllSelected"
            color="secondary"
            dark
            icon
            small
            @click="onNext"
        >
          <v-icon dark>
            mdi-chevron-right
          </v-icon>
        </v-btn>
      </div>
    </template>
    <v-card class="mx-auto pa-4">
      <div
          class="d-flex justify-center"
          style="width: 100%;"
      >
        <CustomDatePickerTabs
            :active-tab="activeTab"
            @change="onTabChange"
        />
      </div>
      <div
          :class="{'d-flex justify-center': activeTab !== TAB_NAMES.customRange}"
          class="mt-5"
      >
        <CustomDatePickerRange
            v-if="activeTab === TAB_NAMES.customRange"
            :range="selectedRange"
            :selected-range-option="selectedRangeOption"
            @customRangeChange="onCustomRangeChange"
            @customRangeInput="onCustomRangeInput"
            @rangeOptionChange="onRangeOptionChange"
        />
        <CustomDatePickerMonth
            v-if="activeTab === TAB_NAMES.month"
            :selected-month="selectedMonth"
            @monthSelect="onMonthSelect"
        />
        <CustomDatePickerYear
            v-if="activeTab === TAB_NAMES.year"
            ref="yearPickerRef"
            :selected-year="selectedRange[0]"
            @yearSelect="onYearSelect"
        />
      </div>
    </v-card>
  </v-menu>
</template>

<script>
import {differenceInDays} from 'date-fns';

import CustomDatePickerMonth from './CustomDatePickerMonth.vue';
import CustomDatePickerYear from './CustomDatePickerYear.vue';
import CustomDatePickerRange from './CustomDatePickerRange.vue';
import CustomDatePickerTabs from './CustomDatePickerTabs.vue';
import {
  DEFAULT_ACTIVE_TAB,
  DEFAULT_RANGE,
  DEFAULT_SELECTED_RANGE_OPTION,
  KEYS_TO_PERSIST,
  PERSIST_DATA_PREFIX_KEY,
  RANGE_VALUE_MAP,
  TAB_NAMES,
} from './date-picker-config';

import {CALCULATE_RANGE_METHODS, formatLabel} from './utils';

export default {
  name: 'CustomDatePicker',
  components: {
    CustomDatePickerMonth,
    CustomDatePickerYear,
    CustomDatePickerRange,
    CustomDatePickerTabs,
  },
  props: {
    range: {
      type: Array,
      default() {
        return [];
      }
    },
    persistData: {
      type: Boolean,
      default: true,
    },
    persistDataKey: {
      type: String,
      default: 'custom_date_picker',
    }
  },
  data: () => ({
    activeTab: DEFAULT_ACTIVE_TAB,
    selectedRangeOption: DEFAULT_SELECTED_RANGE_OPTION,
    selectedRange: DEFAULT_RANGE,
    TAB_NAMES,
    menu: false,
    labelToShow: ''
  }),
  computed: {
    selectedMonth() {
      const [year, month] = this.selectedRange[0].split('-');
      return `${year}-${month}`;
    },
    rangeDiffInDays() {
      return differenceInDays(
          new Date(this.selectedRange[1]),
          new Date(this.selectedRange[0]),
      );
    },
    localStorageKeyName() {
      return `${PERSIST_DATA_PREFIX_KEY}${this.persistDataKey}`;
    },
    isAllSelected() {
      return this.activeTab === TAB_NAMES.customRange && this.selectedRangeOption === RANGE_VALUE_MAP.all;
    }
  },
  watch: {
    selectedRange(value) {
      if (value && value.length >= 2) {
        this.setLabelToShow();
        this.persistDataIfEnabled();
      }
    }
  },
  mounted() {
    this.initRanges();
    this.setLabelToShow();
    this.$emit('init', {type: this.selectedRangeOption, range: this.selectedRange, activeTab: this.activeTab});
  },
  methods: {
    initRanges() {
      if (this.range && this.range.length >= 2) {
        this.selectedRangeOption = RANGE_VALUE_MAP.customRange;
        this.activeTab = TAB_NAMES.customRange;
        this.persistDataIfEnabled('activeTab', this.activeTab);
        this.selectedRange = this.range;
        return;
      }
      const savedData = this.getPersistedData();

      if (this.persistData && savedData) {
        this.activeTab = savedData.activeTab;
        this.selectedRangeOption = savedData.selectedRangeOption;
      }
      this.selectedRange = CALCULATE_RANGE_METHODS[this.activeTab].current(new Date(), this.selectedRangeOption);
    },
    setLabelToShow() {
      this.labelToShow = formatLabel({
        activeTab: this.activeTab,
        selectedRange: this.selectedRange,
        selectedRangeOption: this.selectedRangeOption
      });
    },

    onTabChange(value) {
      this.activeTab = value;
    },
    onYearSelect(date) {
      this.updateSelectedRangeAndEmit(`${date}-01`);
    },
    onMonthSelect(date) {
      this.updateSelectedRangeAndEmit(`${date}-01`);
    },
    onRangeOptionChange(value) {
      this.selectedRangeOption = value;
      if (value !== RANGE_VALUE_MAP.customRange) {
        this.updateSelectedRangeAndEmit(new Date());
      }
    },
    onCustomRangeInput(value) {
      this.selectedRange = value;
    },
    onCustomRangeChange() {
      this.menu = false;
      this.$emit('change', {type: this.selectedRangeOption, range: this.selectedRange, activeTab: this.activeTab});
    },

    onNext() {
      if (this.activeTab === TAB_NAMES.customRange) {
        this.selectedRangeOption = RANGE_VALUE_MAP.customRange;
      }
      this.selectedRange = CALCULATE_RANGE_METHODS[this.activeTab].next(
          this.selectedRange[0],
          this.rangeDiffInDays
      );
      this.$emit('change', {type: this.selectedRangeOption, range: this.selectedRange, activeTab: this.activeTab});
    },
    onPrevious() {
      if (this.activeTab === TAB_NAMES.customRange) {
        this.selectedRangeOption = RANGE_VALUE_MAP.customRange;
      }
      this.selectedRange = CALCULATE_RANGE_METHODS[this.activeTab].previous(
          this.selectedRange[0],
          this.rangeDiffInDays
      );
      this.$emit('change', {type: this.selectedRangeOption, range: this.selectedRange, activeTab: this.activeTab});
    },
    persistDataIfEnabled() {
      if (!this.persistData) {
        return;
      }
      let savedData = this.getPersistedData() || {};
      savedData = KEYS_TO_PERSIST.reduce((acc, key) => {
        // TODO: NEED TO IMPROVE THIS CHECK
        if (this[key] === RANGE_VALUE_MAP.customRange) {
          return acc;
        }

        acc[key] = this[key];
        return acc;
      }, savedData);
      localStorage.setItem(this.localStorageKeyName, JSON.stringify(savedData));
    },
    getPersistedData() {
      return JSON.parse(
          localStorage.getItem(this.localStorageKeyName) || 'null'
      );
    },
    updateSelectedRangeAndEmit(value) {
      this.selectedRange = CALCULATE_RANGE_METHODS[this.activeTab].current(value, this.selectedRangeOption);
      this.menu = false;
      this.$emit('change', {type: this.selectedRangeOption, range: this.selectedRange, activeTab: this.activeTab});
    }
  },
};
</script>
<style scoped>
.centered-input >>> input {
  text-align: center;
}
</style>