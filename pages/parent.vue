<template>
  <div class="Parent">
    <h2 class="Parent-Heading">
      {{ $t('グラフ表示') }}
    </h2>
    <StaticCard>
      <div class='google_map'>
        <iframe src="https://datastudio.google.com/embed/reporting/1ee170d9-f2a8-492e-98d9-e75327dc0cd6/" frameborder="0" style="border:0"></iframe>
      </div>
    </StaticCard>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import StaticCard from '@/components/StaticCard.vue'

type ItemData = {
  items: Item[]
}

type Item = {
  title: string
  body: string
}

export default Vue.extend({
  components: {
    StaticCard
  },
  head(): MetaInfo {
    return {
      title: this.$t('お子様をお持ちの皆様へ') as string
    }
  }
})
</script>

<style lang="scss">
.Parent {
  &-Heading {
    @include font-size(30);
    font-weight: normal;
    color: $gray-2;
    margin-bottom: 12px;
  }
}

.google_map{
    position:relative;
    width:100%;
    height:0;
    padding-top:75%;
}
.google_map iframe{
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
}
</style>