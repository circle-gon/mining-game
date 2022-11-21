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
import Row from "components/layout/Row.vue";
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
  const basicComputer: Buyable<
    BuyableOptions & { effect: ComputedRef<DecimalSource>; title: string }
  > = createBuyable(() => {
    return {
      cost: computed(() => {
        return Decimal.dOne;
      }),
      resource: points,
      effect: computed(() => {
        return basicComputer.amount.value;
      }),
      title: "Basic Computer",
    };
  });

  const computers = [basicComputer];

  const desc = computers.map((i) => (
    <tr>
      <td>{i.title}</td>
      <td>{1}</td>
    </tr>
  ));

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
        <table>{desc}</table>
      </>
    )),
    treeNode,
    computers,
  };
});

export default layer;
