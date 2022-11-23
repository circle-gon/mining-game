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
import { globalBus } from "game/events";
import { createResource } from "features/resources/resource";
import Resource from "features/resources/Resource.vue";
import { createClickable } from "features/clickables/clickable";


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

  const bitcoins = createResource<DecimalSource>(0);
  const problemsSolved = createResource<DecimalSource>(0);
  const computingPower = createResource<DecimalSource>(0);

  const computingPowerGain = computed(() => {
    let power = Decimal.dZero;
    for (const comp of computers) {
      power = power.plus(comp.effect.value);
    }
    return power;
  });

  const computingPowerReq = computed(() => {
    return Decimal.add(problemsSolved.value, 1);
  });

  const progressBar = createBar(() => {
    return {
      direction: Direction.Right,
      width: "100%",
      height: "60px",
      progress: computed(() =>
        Decimal.div(computingPower.value, computingPowerReq.value)
      ),
      display: jsx(() => {
        return (
          <>
            {formatWhole(computingPower.value)}/
            {formatWhole(computingPowerReq.value)} blockchain computations
            <br />
            {format(
              Decimal.div(computingPower.value, computingPowerReq.value).mul(
                100
              )
            )}
            % to next blockchain
          </>
        );
      }),
      textStyle: {
        color: "green",
      },
    };
  });
  /*const bitcoinConvert = createClickable(() => {

  })*/
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

  globalBus.on("update", (diff) => {
    computingPower.value = Decimal.add(
      computingPower.value,
      computingPowerGain.value.mul(diff)
    );

    if (Decimal.gte(computingPower.value, computingPowerReq.value)) {
      computingPower.value = 0;
      problemsSolved.value = Decimal.add(problemsSolved.value, 1);
      bitcoins.value = Decimal.add(bitcoins.value, 1);
    }
  });

  return {
    name,
    color,
    display: jsx(() => (
      <>
        You have <Resource color="yellow" resource={bitcoins} /> bitcoins.
        <br />
        Complete a blockchain to get 1 bitcoin!
        <br />
        You have completed {formatWhole(problemsSolved.value)} blockchains.
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
                  1 {i.title} gives +{formatWhole(i.each.value)} blockchain
                  computations per second
                  <br />
                  Does {formatWhole(i.effect.value)} blockchain computations per
                  second.
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
    problemsSolved,
    computingPower,
    bitcoins
  };
});

export default layer;
