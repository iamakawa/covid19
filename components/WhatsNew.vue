<template>
  <div class="WhatsNew">
    <h2 class="WhatsNew-heading">
      <v-icon class="WhatsNew-heading-icon">mdi-information</v-icon>
      {{ $t('最新のお知らせ') }}（{{ $t('岐阜県公式HPより') }}）
    </h2>
    <div v-for="(item, i) in items" :key="i">
      <a class="WhatsNew-item" :href="item.url" target="_blank" rel="noopener">
        <time class="WhatsNew-item-time px-2">{{ item.date }}</time>
        <span class="WhatsNew-item-link">
            {{ item.text }}
            <v-icon size="12" class="WhatsNew-ExternalIcon">mdi-open-in-new</v-icon>
        </span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss">
.WhatsNew {
  @include card-container();
  padding: 10px;
}

.WhatsNew-heading {
  display: flex;
  align-items: center;
  margin-bottom: .5em;
  font-size: 14px;
  line-height: 1.2em;
  color: $gray-2;

  &-icon {
    margin: 2px;
  }
}

.WhatsNew-item {
  display: flex;
  text-decoration: none;
  margin: 5px 2px;
  font-size: 14px;

  @include lessThan($medium) {
    flex-wrap: wrap;
  }

  &-time {
    flex: 0 0 90px;
    @include lessThan($medium) {
      flex: 0 0 100%;
    }
    color: $gray-1;
  }

  &-link {
    flex: 0 1 auto;
    @include text-link();
    @include lessThan($medium) {
      padding-left: 8px;
    }
  }
}
</style>
