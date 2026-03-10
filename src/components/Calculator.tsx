import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const formatResult = (value: number) =>
  Number.isInteger(value)
    ? value.toString()
    : value.toFixed(8).replace(/0+$/, "").replace(/\.$/, "");

const resolveBinaryOperation = (prev: string, curr: string, operator: string) => {
  const left = parseFloat(prev);
  const right = parseFloat(curr);
  let result = 0;

  switch (operator) {
    case "+":
      result = left + right;
      break;
    case "-":
      result = left - right;
      break;
    case "×":
      result = left * right;
      break;
    case "÷":
      result = right !== 0 ? left / right : 0;
      break;
    default:
      return null;
  }

  return formatResult(result);
};

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [resetNext, setResetNext] = useState(false);

  const handleNumber = (num: string) => {
    if (resetNext) {
      setDisplay(num);
      setResetNext(false);
      return;
    }

    setDisplay((currentDisplay) => (currentDisplay === "0" ? num : currentDisplay + num));
  };

  const handleDecimal = () => {
    if (resetNext) {
      setDisplay("0.");
      setResetNext(false);
      return;
    }

    if (!display.includes(".")) setDisplay(`${display}.`);
  };

  const handleOperation = useCallback(
    (nextOperation: string) => {
      if (previousValue && operation && !resetNext) {
        const result = resolveBinaryOperation(previousValue, display, operation);
        if (!result) return;

        setDisplay(result);
        setPreviousValue(result);
        setOperation(nextOperation);
        setResetNext(true);
        return;
      }

      setPreviousValue(display);
      setOperation(nextOperation);
      setResetNext(true);
    },
    [display, operation, previousValue, resetNext],
  );

  const calculate = useCallback(() => {
    if (!previousValue || !operation) return;

    const result = resolveBinaryOperation(previousValue, display, operation);
    if (!result) return;

    setDisplay(result);
    setPreviousValue(null);
    setOperation(null);
    setResetNext(true);
  }, [display, operation, previousValue]);

  const handleClear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setResetNext(false);
  };

  const handlePercent = useCallback(() => {
    const result = formatResult(parseFloat(display) / 100);
    setDisplay(result);
    setResetNext(true);
  }, [display]);

  const handleSquareRoot = useCallback(() => {
    const value = parseFloat(display);
    if (value < 0) return;

    const result = formatResult(Math.sqrt(value));
    setDisplay(result);
    setResetNext(true);
  }, [display]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      const key = event.key;
      const numberKeys = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);

      if (numberKeys.has(key)) {
        event.preventDefault();
        if (resetNext) {
          setDisplay(key);
          setResetNext(false);
          return;
        }

        setDisplay((currentDisplay) => (currentDisplay === "0" ? key : currentDisplay + key));
        return;
      }

      if (key === ".") {
        event.preventDefault();
        if (resetNext) {
          setDisplay("0.");
          setResetNext(false);
          return;
        }

        if (!display.includes(".")) setDisplay(`${display}.`);
        return;
      }

      if (key === "+" || key === "-") {
        event.preventDefault();
        handleOperation(key);
        return;
      }

      if (key === "*" || key.toLowerCase() === "x") {
        event.preventDefault();
        handleOperation("×");
        return;
      }

      if (key === "/") {
        event.preventDefault();
        handleOperation("÷");
        return;
      }

      if (key === "%" || key.toLowerCase() === "r") {
        event.preventDefault();
        if (key === "%") {
          handlePercent();
          return;
        }

        handleSquareRoot();
        return;
      }

      if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
        return;
      }

      if (key === "Backspace") {
        event.preventDefault();
        if (resetNext) {
          setDisplay("0");
          setResetNext(false);
          return;
        }

        setDisplay((currentDisplay) => {
          if (currentDisplay.length <= 1) return "0";
          if (currentDisplay.length === 2 && currentDisplay.startsWith("-")) return "0";
          return currentDisplay.slice(0, -1);
        });
        return;
      }

      if (key === "Escape" || key === "Delete") {
        event.preventDefault();
        handleClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [calculate, display, handleOperation, handlePercent, handleSquareRoot, resetNext]);

  const buttons = [
    { label: "C", type: "func" as const, action: handleClear },
    { label: "√", type: "func" as const, action: handleSquareRoot },
    { label: "%", type: "func" as const, action: handlePercent },
    { label: "÷", type: "op" as const, action: () => handleOperation("÷") },
    { label: "7", type: "num" as const, action: () => handleNumber("7") },
    { label: "8", type: "num" as const, action: () => handleNumber("8") },
    { label: "9", type: "num" as const, action: () => handleNumber("9") },
    { label: "×", type: "op" as const, action: () => handleOperation("×") },
    { label: "4", type: "num" as const, action: () => handleNumber("4") },
    { label: "5", type: "num" as const, action: () => handleNumber("5") },
    { label: "6", type: "num" as const, action: () => handleNumber("6") },
    { label: "-", type: "op" as const, action: () => handleOperation("-") },
    { label: "1", type: "num" as const, action: () => handleNumber("1") },
    { label: "2", type: "num" as const, action: () => handleNumber("2") },
    { label: "3", type: "num" as const, action: () => handleNumber("3") },
    { label: "+", type: "op" as const, action: () => handleOperation("+") },
    { label: "0", type: "num" as const, action: () => handleNumber("0"), wide: true },
    { label: ".", type: "num" as const, action: handleDecimal },
    { label: "=", type: "op" as const, action: calculate },
  ];

  const getButtonClasses = (type: "num" | "op" | "func") => {
    const base =
      "flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-b-[3px] text-lg font-bold transition-colors duration-150";

    switch (type) {
      case "num":
        return `${base} bg-secondary/50 border-secondary text-foreground hover:bg-secondary/70`;
      case "op":
        return `${base} bg-primary/70 border-primary text-primary-foreground hover:bg-primary/90`;
      case "func":
        return `${base} bg-primary/50 border-primary/70 text-primary-foreground hover:bg-primary/70`;
    }
  };

  const displayFontSize =
    display.length > 12
      ? "text-xl"
      : display.length > 8
        ? "text-2xl"
        : display.length > 5
          ? "text-3xl"
          : "text-4xl";

  return (
    <div className="relative w-[340px] min-w-[340px] max-w-[340px] overflow-hidden rounded-[2rem] border-2 border-secondary bg-secondary/60 p-6 shadow-xl">
      <div className="relative mb-4 flex h-[112px] flex-col justify-between overflow-hidden rounded-xl border-2 border-border/50 bg-muted/80 p-4 shadow-inner">
        <div className="h-5 overflow-hidden">
          <AnimatePresence mode="wait">
            {previousValue && operation && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="truncate text-right text-sm text-muted-foreground"
              >
                {previousValue} {operation}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          key={display}
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
          className={`flex min-h-[2.5rem] items-end justify-end overflow-hidden text-right ${displayFontSize} font-black tracking-[-0.04em] text-foreground tabular-nums`}
          style={{
            fontFamily: "'Arial Rounded MT Bold', 'Trebuchet MS', 'Segoe UI', sans-serif",
            fontVariantNumeric: "tabular-nums lining-nums",
            textShadow: "0 1px 0 hsl(var(--background) / 0.65)",
          }}
        >
          <span className="block max-w-full truncate whitespace-nowrap">{display}</span>
        </motion.div>
      </div>

      <div className="grid grid-cols-4 place-items-center gap-2">
        {buttons.map((btn, i) => (
          <motion.button
            key={btn.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02, duration: 0.25 }}
            whileTap={{ scale: 0.9, y: 2 }}
            onClick={btn.action}
            className={`${getButtonClasses(btn.type)} ${"wide" in btn && btn.wide ? "col-span-2 !w-[140px] !rounded-full" : ""}`}
            type="button"
          >
            {btn.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
