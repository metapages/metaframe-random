import {
  HStack,
  IconButton,
  Show,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { Random } from "/@/components/Random";
import { HamburgerIcon, ViewIcon, EditIcon, InfoIcon } from "@chakra-ui/icons";
import { useHashParamBoolean } from "@metapages/hash-query";
import { useCallback } from "react";
import { HelpPanel } from "/@/components/HelpPanel";
import { OptionsPanel } from "/@/components/OptionsPanel";
import "./app.css";

export const App: React.FC = () => {
  const [hideMenu, sethideMenu] = useHashParamBoolean("hidemenu");

  const toggleMenu = useCallback(() => {
    sethideMenu(!hideMenu);
  }, [hideMenu, sethideMenu]);

  const ButtonTabsToggle = (
    <IconButton
      aria-label="options"
      variant="ghost"
      onClick={toggleMenu}
      icon={<HamburgerIcon />}
    />
  );

  if (hideMenu) {
    return (
      <>
        <HStack
          style={{ position: "absolute" }}
          width="100%"
          justifyContent="flex-end"
        >
          <Spacer />
          <Show breakpoint="(min-width: 200px)">{ButtonTabsToggle}</Show>
        </HStack>
        <Random />
      </>
    );
  }
  return (
    <Tabs>
      <TabList>
        <Tab>
          <ViewIcon /> &nbsp; Random numbers
        </Tab>
        <Tab>
          <EditIcon /> &nbsp; Options
        </Tab>
        <Tab>
          <InfoIcon />
          &nbsp; Help
        </Tab>
        <Spacer /> {ButtonTabsToggle}
      </TabList>

      <TabPanels>
        <TabPanel>
          <Random />
        </TabPanel>
        <TabPanel>
          <OptionsPanel />
        </TabPanel>
        <TabPanel>
          <HelpPanel />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
