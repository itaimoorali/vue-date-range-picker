# vue-date-range-picker

## Usage

### Coming Soon

## Live Demo

[vue-date-range-picker.netlify.com](https://vue-date-range-picker.netlify.app/)

**NOTE**: Date format must be `yyyy-MM-dd`

## Props

|  Name | Type   | Required | default | Description |
| ------------ | ------------ | ------------ | ------------ | ------------ | 
|  range | Array   | No | [START_RANGE,END_RANGE] | Both start and end range must be in `yyyy-MM-dd` format |
|  persistData | Boolean   | No | true  | Pass false if you do not want to save the state in localstorage|
|  persistDataKey | String   | No | 'custom_date_picker'  | If you want to use multiple components on same or different pages and want them to not share the state, then you can pass a unique name for each one of them |

## Events

|  Name | Arguments   | Description |
| ------------ | ------------ | ------------ |
|  init | type, range, activeTab   | This gets called when component is mounted. |
|  change | type, range, activeTab   | This gets called every time when there is a change in change |

### Arguments Type

|  Name | type   | Example |
| ------------ | ------------ | ------------ |
|  range | Array   | ['2012-01-01', '2012-12-31'] |
|  type | number OR string   | **7** or **31** or **90** or **365** or **custom-range** or **all**   |
|  activeTab | string   | **range** or **month** or **year** |

#### 'type'

- _7_ (number) means Last 7 days is selected.
- _31_ (number) means Last 31 days is selected.
- _90_ (number) means Last 90 days is selected.
- _365_ (number) means Last 12 months is selected.
- _all_ (string) means all option from Range tab is selected.
- _custom-range_ (string) means a custom range is selected.

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
