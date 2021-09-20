import { FunctionalComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Box, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import random from "random";
import { ButtonHelp } from "./ButtonHelp";
import { Option } from "/@/components/ButtonOptionsMenu";
import { useHashParamJson, useMetaframe } from "@metapages/metaframe-hook";

type Distributions = "uniform" | "uniformInt" | "normal" | "sin";

export const options: Option[] = [
  {
    name: "frequency",
    displayName: "Frequency (per second)",
    default: 1,
    type: "number",
  },
  {
    name: "distribution",
    displayName: "Distribution",
    default: "uniform",
    type: "option",
    options: ["uniform", "uniformInt", "normal", "sin"],
    suboptions: {
      uniform: [
        {
          name: "min",
          displayName: "Min",
          default: 0,
          type: "number",
        },
        {
          name: "max",
          displayName: "Max",
          default: 1,
          type: "number",
        },
      ],
      uniformInt: [
        {
          name: "min",
          displayName: "Min",
          default: 0,
          type: "number",
        },
        {
          name: "max",
          displayName: "Max",
          default: 10,
          type: "number",
        },
      ],
      uniformBoolean: [],
      normal: [
        {
          name: "mu",
          displayName: "mu",
          default: 0,
          type: "number",
        },
        {
          name: "sigma",
          displayName: "sigma",
          default: 1,
          type: "number",
        },
      ],
      sin: [
        {
          name: "increment",
          displayName: "increment",
          default: 0.01,
          type: "number",
        },
      ],
    },
  },
];

export const Random: FunctionalComponent = () => {
  const metaframe = useMetaframe();
  const [optionsInHashParams] =
    useHashParamJson<{ [name in string]: string | boolean | number }>(
      "options"
    );
  const [rand, setRand] = useState<{ f: number; rand: () => number }>({
    f: 1,
    rand: random.uniform(0, 1),
  });
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    if (!optionsInHashParams) {
      return;
    }
    let dist: Distributions = "uniform";
    const min: number =
      optionsInHashParams["min"] !== undefined
        ? (optionsInHashParams["min"] as number)
        : 0;
    const max: number =
      optionsInHashParams["max"] !== undefined
        ? (optionsInHashParams["max"] as number)
        : 1;
    const mu: number =
      optionsInHashParams["mu"] !== undefined
        ? (optionsInHashParams["mu"] as number)
        : 0;
    const sigma: number =
      optionsInHashParams["sigma"] !== undefined
        ? (optionsInHashParams["sigma"] as number)
        : 1;
    const increment: number =
      optionsInHashParams["increment"] !== undefined
        ? (optionsInHashParams["increment"] as number)
        : 0.01;

    const f: number =
      optionsInHashParams["frequency"] !== undefined
        ? (optionsInHashParams["frequency"] as number)
        : 1;

    if (optionsInHashParams["distribution"]) {
      dist = optionsInHashParams["distribution"] as Distributions;
    }

    switch (dist) {
      case "uniform":
        setRand({ f, rand: random.uniform(min, max) });
        break;
      case "uniformInt":
        setRand({ f, rand: random.uniformInt(Math.floor(min), Math.floor(max)) });
        break;
      case "normal":
        setRand({ f, rand: random.normal(mu, sigma) });
        break;
      case "sin":
        let current :number = 0.01;
        setRand({ f, rand: () => {
          current += increment;
          return Math.sin(current);
         }});
        break;
    }
  }, [optionsInHashParams]);

  useEffect(() => {
    if (!metaframe) {
      return;
    }

    const handle = setInterval(() => {
      const val = rand.rand();
      metaframe.metaframe?.setOutput("v", val);
      setValue(val);
    }, 1000 / rand.f);

    return () => {
      clearInterval(handle);
    };
  }, [metaframe, rand]);

  return <div>{value}</div>;
};
