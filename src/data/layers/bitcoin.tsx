/**
 * @module
 * @hidden
 */
import { jsx, OptionsFunc } from "features/feature";
import { BaseLayer, createLayer } from "game/layers";
import type { DecimalSource } from "util/bignum";
import Decimal, { formatWhole, format } from "util/bignum";
import { createLayerTreeNode } from "../common";
import { main } from "../projEntry";
import { createBuyable } from "features/buyable";
import type {
  Buyable,
  BuyableOptions,
  BaseBuyable,
  GenericBuyable,
} from "features/buyable";
import { computed } from "vue";
import type { ComputedRef } from "vue";
import { render } from "util/vue";
import { createBar } from "features/bars/bar";
import { createLazyProxy } from "util/proxies";
import { Direction } from "util/common";

const id = "bc";

interface ComputerBuyable extends BuyableOptions {
  title: string;
  each: ComputedRef<DecimalSource>;
  effect: ComputedRef<DecimalSource>;
}
function createComputerBuyable<T extends ComputerBuyable>(
  callback: OptionsFunc<T, BaseBuyable, GenericBuyable>
): Buyable<T> {
  return createLazyProxy(() => {
    return createBuyable(callback);
  });
}
const layer = createLayer(id, function (this: BaseLayer) {
  const name = "Bitcoin";
  const color = "#4BDC13";

  const treeNode = createLayerTreeNode(() => ({
    layerID: id,
    color,
  }));

  const progressBar = createBar(() => {
    return {
      direction: Direction.Right,
      width: 300,
      height: 30,
      progress: computed(() => 0.5),
    };
  });
  const basicComputer: Buyable<ComputerBuyable> = createComputerBuyable(() => {
    return {
      cost: computed(() => {
        return Decimal.dOne;
      }),
      resource: main.points,
      effect: computed(() => {
        return Decimal.mul(
          basicComputer.amount.value,
          basicComputer.each.value
        );
      }),
      each: computed(() => {
        return Decimal.dOne;
      }),
      title: "Basic Computer",
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
      <>
        {render(progressBar)}
        <table style="width: 100%;">
          {computers.map((i) => (
            <>
              <tr>
                <td>
                  {i.title} [{formatWhole(i.amount.value)}]
                </td>
                <td>{render(i)}</td>
                <td>
                  1 {i.title} gives {format(i.each.value)} computing power
                  <br />
                  This is currently giving {format(i.effect.value)} computing
                  power
                </td>
              </tr>
            </>
          ))}
        </table>
      </>
    )),
    treeNode,
    computers,
    progressBar,
  };
});

export default layer;
