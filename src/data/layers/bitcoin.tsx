/**
 * @module
 * @hidden
 */
import { jsx } from "features/feature";
import { BaseLayer, createLayer } from "game/layers";
import type { DecimalSource } from "util/bignum";
import Decimal, { formatWhole } from "util/bignum";
import { createLayerTreeNode } from "../common";
import { main } from "../projEntry";
import { createBuyable } from "features/buyable";
import type { Buyable, BuyableOptions } from "features/buyable";
import { computed } from "vue";
import type { ComputedRef } from "vue";
import { render } from "util/vue";
import { createBar } from "features/bars/bar";

const id = "bc";
const layer = createLayer(id, function (this: BaseLayer) {
  const name = "Bitcoin";
  const color = "#4BDC13";

  const treeNode = createLayerTreeNode(() => ({
    layerID: id,
    color,
  }));
  const basicComputer: Buyable<
    BuyableOptions & {
      effect: ComputedRef<DecimalSource>;
      title: string;
      description: ComputedRef<JSX.Element>;
    }
  > = createBuyable(() => {
    return {
      cost: computed(() => {
        return Decimal.dOne;
      }),
      resource: main.points,
      effect: computed(() => {
        return basicComputer.amount.value;
      }),
      title: "Basic Computer",
      description: computed(() => {
        return <>Gives 1 computing power per second.</>;
      }),
      display: computed(() => {
        return {
          showAmount: false,
        };
      }),
    };
  });

  const computers = [basicComputer];

  return {
    name,
    color,
    display: jsx(() => (
      <table style="width: 100%;">
        {computers.map((i) => (
          <>
            <tr>
              <td>{i.title}</td>
              <td>{formatWhole(i.amount.value)}</td>
              <td>{render(i)}</td>
            </tr>
            <tr>
              <td colspan="3">{i.description.value}</td>
            </tr>
          </>
        ))}
      </table>
    )),
    treeNode,
    computers,
  };
});

export default layer;
