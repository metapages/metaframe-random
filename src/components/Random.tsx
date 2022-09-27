import { useEffect, useMemo, useState } from "react";
import random from "random";
import { useMetaframe } from "@metapages/metaframe-hook";
import { useHashParamJson } from "@metapages/hash-query";
import {
  defaultOptions,
  defaultOptionsSin,
  DistributionOptions,
  DistributionOptionsNormal,
  DistributionOptionsSin,
  DistributionOptionsUniform,
  DistributionOptionsUniformInt,
} from "/@/components/OptionsPanel";
import { CheckIcon } from "@chakra-ui/icons";

export const Random: React.FC = () => {
  const metaframe = useMetaframe();

  const [options] = useHashParamJson<DistributionOptions>(
    "distribution",
    defaultOptions
  );

  const [rand, setRand] = useState<{
    frequency: number;
    rand: () => number | boolean;
  }>({
    frequency: 1,
    rand: random.uniform(0, 1),
  });
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    if (!options) {
      return;
    }

    let dist = options.distribution;
    let frequency = options.frequency;

    switch (dist) {
      case "uniform":
        const uniformOptions = options.options as DistributionOptionsUniform;
        setRand({
          frequency,
          rand: random.uniform(uniformOptions.min, uniformOptions.max),
        });
        break;
      case "uniformInt":
        const uniformIntOptions =
          options.options as DistributionOptionsUniformInt;
        setRand({
          frequency,
          rand: random.uniformInt(
            Math.floor(uniformIntOptions.min),
            Math.floor(uniformIntOptions.max)
          ),
        });
        break;
      case "uniformBoolean":
        setRand({ frequency, rand: random.uniformBoolean() });
        break;
      case "normal":
        const uniformNormalOptions =
          options.options as DistributionOptionsNormal;
        setRand({
          frequency,
          rand: random.normal(
            uniformNormalOptions.mu,
            uniformNormalOptions.sigma
          ),
        });
        break;
      case "sin":
        const sinOptions = options.options as DistributionOptionsSin;
        const increment = sinOptions.increment ?? defaultOptionsSin.increment;
        let current: number = 0.01;
        setRand({
          frequency,
          rand: () => {
            current += increment;
            return Math.sin(current);
          },
        });
        break;
    }
  }, [options]);

  useEffect(() => {
    if (!metaframe) {
      return;
    }

    const handle = setInterval(() => {
      const val = rand.rand();
      metaframe.metaframe?.setOutput("v", val);
      if (options.showOutput) {
        setValue(`${val}`);
      }
    }, 1000 / rand.frequency);

    return () => {
      clearInterval(handle);
    };
  }, [metaframe, rand, options.showOutput, setValue]);

  const staticEmittingText = useMemo(
    () => (
      <>
        Emitting <CheckIcon color="green" />
      </>
    ),
    []
  );

  return <div>{options.showOutput ? value : staticEmittingText}</div>;
};
