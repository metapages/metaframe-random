import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Select,
  Switch,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useCallback } from "react";
import * as yup from "yup";
import { useHashParamJson } from "@metapages/hash-query";

export type Distribution =
  | "uniform"
  | "uniformInt"
  | "uniformBoolean"
  | "normal"
  | "sin";

const distributions: Distribution[] = [
  "uniform",
  "uniformInt",
  "uniformBoolean",
  "normal",
  "sin",
];

export type DistributionTypeOptions =
  | DistributionOptionsUniform
  | DistributionOptionsUniformInt
  | DistributionOptionsUniformBoolean
  | DistributionOptionsNormal
  | DistributionOptionsSin;

export type DistributionOptions = {
  showOutput?: boolean;
  frequency: number; // "Frequency (per second)"
  distribution: Distribution;
  options: DistributionTypeOptions;
};

export type DistributionOptionsUniform = {
  min: number;
  max: number;
};

export type DistributionOptionsUniformInt = {
  min: number;
  max: number;
};

export type DistributionOptionsUniformBoolean = {};

export type DistributionOptionsNormal = {
  mu: number;
  sigma: number;
};

export type DistributionOptionsSin = {
  increment: number;
};

export const defaultOptionsUniform: DistributionOptionsUniform = {
  min: 0,
  max: 1,
};

export const defaultOptionsUniformInt: DistributionOptionsUniformInt = {
  min: 0,
  max: 10,
};

export const defaultOptionsNormal: DistributionOptionsNormal = {
  mu: 0,
  sigma: 10,
};

export const defaultOptionsSin: DistributionOptionsSin = {
  increment: 0.01,
};

export const defaultOptions: DistributionOptions = {
  frequency: 1,
  distribution: "uniform",
  options: defaultOptionsUniform,
};

const validationSchema = yup.object({
  showOutput: yup.boolean().optional(),
  frequency: yup.number(),
  distribution: yup.string(),
  distributionOptionsMin: yup.number().optional(),
  distributionOptionsMax: yup.number().optional(),
  distributionOptionsIncrement: yup.number().optional(),
  distributionOptionsMu: yup.number().optional(),
  distributionOptionsSigma: yup.number().optional(),
});
interface FormType extends yup.InferType<typeof validationSchema> {}

export const OptionsPanel: React.FC = () => {
  const [options, setOptions] = useHashParamJson<DistributionOptions>(
    "distribution",
    defaultOptions
  );

  const onSubmit = useCallback(
    (values: FormType) => {
      const newDistributionType =
        (values.distribution as Distribution) ?? "uniform";
      const newFrequency = values.frequency ?? 1;

      let distributionSubOptions: DistributionTypeOptions | undefined;
      switch (newDistributionType) {
        case "uniform":
          distributionSubOptions = {
            min: values.distributionOptionsMin ?? defaultOptionsUniform.min,
            max: values.distributionOptionsMax ?? defaultOptionsUniform.max,
          };
          break;
        case "uniformInt":
          distributionSubOptions = {
            min: values.distributionOptionsMin ?? defaultOptionsUniformInt.min,
            max: values.distributionOptionsMax ?? defaultOptionsUniformInt.max,
          };
          break;
        case "uniformBoolean":
          distributionSubOptions = {};
          break;
        case "normal":
          distributionSubOptions = {
            mu: values.distributionOptionsMu ?? defaultOptionsNormal.mu,
            max: values.distributionOptionsSigma ?? defaultOptionsNormal.sigma,
          };
          break;
        case "sin":
          distributionSubOptions = {
            increment:
              values.distributionOptionsIncrement ??
              defaultOptionsSin.increment,
          };
          break;
        default:
          distributionSubOptions = defaultOptionsUniform;
      }

      const newOptions: DistributionOptions = {
        distribution: newDistributionType,
        frequency: newFrequency,
        options: distributionSubOptions,
        showOutput: values.showOutput,
      };
      setOptions(newOptions);
    },
    [setOptions]
  );

  const formik = useFormik({
    initialValues: {
      showOutput: options.showOutput,
      frequency: options.frequency,
      distribution: options.distribution,
      distributionOptionsMin: (options.options as any)?.min ?? 0,
      distributionOptionsMax: (options.options as any)?.max ?? 1,
      distributionOptionsIncrement:
        (options.options as any)?.increment ?? defaultOptionsSin.increment,
      distributionOptionsMu:
        (options.options as any)?.mu ?? defaultOptionsNormal.mu,
      distributionOptionsSigma:
        (options.options as any)?.sigma ?? defaultOptionsNormal.sigma,
    },
    onSubmit,

    validationSchema,
  });

  const handleDistributionChange = useCallback(
    (e: React.ChangeEvent<any>) => {
      formik.setFieldValue("distribution", e.target.value);
      formik.submitForm();
    },
    [formik]
  );

  const handleSwitch = useCallback(
    (e: React.ChangeEvent<any>) => {
      formik.setFieldValue("showOutput", e.target.checked);
      formik.submitForm();
    },
    [formik]
  );

  return (
    <>
      <br />
      <form onSubmit={formik.handleSubmit}>
        <FormControl>
          <FormLabel htmlFor="showOutput">
            Show output (can slow down performance)
          </FormLabel>
          <Switch
            id="showOutput"
            onChange={handleSwitch}
            isChecked={formik.values.showOutput}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="frequency">Frequency (random/s):</FormLabel>

          <InputGroup>
            <Input
              id="frequency"
              name="frequency"
              type="number"
              // variant="filled"
              onChange={formik.handleChange}
              value={formik.values.frequency}
            />
          </InputGroup>
        </FormControl>

        <FormControl>
          <FormLabel>Distribution</FormLabel>
          <Select
            name="distribution"
            placeholder="Select distribution"
            onChange={handleDistributionChange} // or {form.handleChange}
            value={formik.values.distribution}
          >
            {distributions.map((d) => (
              <option key={d} id={d} value={d}>
                {d}
              </option>
            ))}
          </Select>
        </FormControl>

        {options.distribution === "uniform" ||
        options.distribution === "uniformInt" ? (
          <>
            <FormControl>
              <FormLabel htmlFor="distributionOptionsMin">Minimum</FormLabel>

              <InputGroup>
                <Input
                  id="distributionOptionsMin"
                  name="distributionOptionsMin"
                  type="number"
                  step="any"
                  // variant="filled"
                  onChange={formik.handleChange}
                  value={formik.values.distributionOptionsMin}
                />
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="distributionOptionsMax">Maximum</FormLabel>

              <InputGroup>
                <Input
                  id="distributionOptionsMax"
                  name="distributionOptionsMax"
                  type="number"
                  step="any"
                  // variant="filled"
                  onChange={formik.handleChange}
                  value={formik.values.distributionOptionsMax}
                />
              </InputGroup>
            </FormControl>
          </>
        ) : null}

        {options.distribution === "normal" ? (
          <>
            <FormControl>
              <FormLabel htmlFor="distributionOptionsMu">μ</FormLabel>

              <InputGroup>
                <Input
                  id="distributionOptionsMu"
                  name="distributionOptionsMu"
                  type="number"
                  step="any"
                  // variant="filled"
                  onChange={formik.handleChange}
                  value={formik.values.distributionOptionsMu}
                />
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="distributionOptionsSigma">σ</FormLabel>

              <InputGroup>
                <Input
                  id="distributionOptionsSigma"
                  name="distributionOptionsSigma"
                  type="number"
                  step="any"
                  // variant="filled"
                  onChange={formik.handleChange}
                  value={formik.values.distributionOptionsSigma}
                />
              </InputGroup>
            </FormControl>
          </>
        ) : null}

        {options.distribution === "sin" ? (
          <FormControl>
            <FormLabel htmlFor="distributionOptionsIncrement">
              increment
            </FormLabel>

            <InputGroup>
              <Input
                id="distributionOptionsIncrement"
                name="distributionOptionsIncrement"
                type="number"
                step="any"
                // variant="filled"
                onChange={formik.handleChange}
                value={formik.values.distributionOptionsIncrement}
              />
            </InputGroup>
          </FormControl>
        ) : null}

        <Button type="submit" display="none">
          submit
        </Button>
      </form>
    </>
  );
};
