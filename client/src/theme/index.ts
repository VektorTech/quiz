import {
  defineStyle,
  defineStyleConfig,
  extendTheme,
  withDefaultColorScheme,
} from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const inputSelectStyles = defineStyleConfig({
  defaultProps: {
    variant: "outline",
  },
  variants: {
    outline: (props) => ({
      field: {
        _focusVisible: {
          borderColor: mode("brand.500", "brand.300")(props),
          boxShadow: `0 0 0 3px ${mode(
            "var(--chakra-colors-brand-100)",
            "var(--chakra-colors-brand-50)"
          )(props)}`,
        },
      },
    }),
  },
  sizes: {
    md: {
      field: {
        borderRadius: "none",
      },
    },
  },
});

const CheckboxRadioStyles = defineStyleConfig({
  baseStyle: (props) => ({
    control: {
      borderRadius: 0,
      _focus: {
        borderColor: mode("brand.500", "brand.300")(props),
        boxShadow: `0 0 0 3px ${mode(
          "var(--chakra-colors-brand-100)",
          "var(--chakra-colors-brand-50)"
        )(props)}`,
      },
      _checked: {
        backgroundColor: mode("brand.500", "brand.300")(props),
        borderColor: mode("brand.500", "brand.300")(props),

        _hover: {
          borderColor: mode("brand.500", "brand.300")(props),
          backgroundColor: mode("brand.500", "brand.300")(props),
        },
      },
    },
  }),
});

const components = {
  Button: {
    baseStyle: {
      rounded: "none",
    },
  },
  Input: inputSelectStyles,
  NumberInput: inputSelectStyles,
  Select: inputSelectStyles,
  Textarea: defineStyleConfig({
    variants: {
      outline: defineStyle(
        (props) => inputSelectStyles.variants?.outline(props).field ?? {}
      ),
    },
    sizes: {
      md: {
        borderRadius: 0,
      },
    },
  }),
  Checkbox: CheckboxRadioStyles,
};

export default extendTheme(
  {
    colors: {
      brand: {
        50: "#F1EBFA",
        100: "#D4C3F0",
        200: "#BCA2E7",
        300: "#A27DDE",
        400: "#8858D4",
        500: "#6E34CB",
        600: "#582AA2",
        700: "#421F7A",
        800: "#2C1551",
        900: "#160A29",
      },
    },
    components,
    sizes: {
      container: {
        lg: "860px",
        xl: "1024"
      }
    }
  },
  withDefaultColorScheme({
    colorScheme: "brand",
  }),
);
