import { FunctionalComponent } from "preact";
import { Flex, Heading, SimpleGrid, Spacer, Stack } from "@chakra-ui/react";
import { Header } from "/@/components/Header";
import { Option } from "/@/components/ButtonOptionsMenu";
import { ButtonOptionsMenu } from "/@/components/ButtonOptionsMenu";
import { ButtonHelp } from '../components/ButtonHelp';
import { Random, options } from '../components/Random';

export const Home: FunctionalComponent = () => (


<Flex>
  <Flex flexDirection="column">
    <Random/>
  </Flex>
  <Spacer />
  <ButtonHelp />
  <ButtonOptionsMenu options={options} />
</Flex>

);
