/**
 * @module
 * @hidden
 */
import { jsx } from "features/feature";
import MainDisplay from "features/resources/MainDisplay.vue";
import { createResource } from "features/resources/resource";
import { addTooltip } from "features/tooltips/tooltip";
import { createResourceTooltip } from "features/trees/tree";
import { BaseLayer, createLayer } from "game/layers";
import type { DecimalSource } from "util/bignum";
import Decimal from "util/bignum";
import { createLayerTreeNode } from "../common";
import { createBuyable } from "features/buyable";
import type { Buyable, BuyableOptions } from "features/buyable";
import { computed, ComputedRef } from "vue";
import { render } from "util/vue";

const id = "bc";
const layer = createLayer(id, function (this: BaseLayer) {
  const name = "Bitcoin";
  const color = "#4BDC13";
  const points = createResource<DecimalSource>(1, "bitcoins");

  const treeNode = createLayerTreeNode(() => ({
    layerID: id,
    color,
  }));
  const bitcoinMiner1: Buyable<
    BuyableOptions & { effect: ComputedRef<DecimalSource> }
  > = createBuyable(() => {
    return {
      cost: computed(() => {
        return Decimal.dOne;
      }),
      resource: points,
      effect: computed(() => {
        return bitcoinMiner1.amount.value;
      }),
      display: computed(() => {
        return {
          title: "Basic Computer",
          description: `Each computer gives 1 computing power per second. Currently: ${bitcoinMiner1.effect.value}`,
        };
      }),
    };
  });

  addTooltip(treeNode, {
    display: createResourceTooltip(points),
    pinnable: true,
  });

  return {
    name,
    color,
    points,
    display: jsx(() => (
      <>
        <MainDisplay resource={points} color={color} />
        {render(bitcoinMiner1)}
      </>
    )),
    treeNode,
    bitcoinMiner1,
  };
});

export default layer;
