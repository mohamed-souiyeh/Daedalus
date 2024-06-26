import { algosKeys, mazeGenerationAlgorithms, mazeSolvingAlgorithms } from "@/src/configs/algos.config";
import { globals } from "@/src/configs/globals";
import { Card, CardBody, CardFooter, CardHeader, Divider } from "@nextui-org/react";
import { useEffect, useState } from "react";


export const AlgorithmDescription = (props: { algo: any }) => {

  const [algorithmDescription, setAlgorithmDescription] = useState<string | undefined>("chouse an algorithm first");
  const [algorithmName, setAlgorithmName] = useState<string | undefined>("");

  useEffect(() => {
    if (mazeSolvingAlgorithms.find((item) => item.key === Array.from(props.algo)[0] as algosKeys)) {
      setAlgorithmDescription(mazeSolvingAlgorithms.find((item) => item.key === Array.from(props.algo)[0] as algosKeys)?.description);
      setAlgorithmName(`Name: ${mazeSolvingAlgorithms.find((item) => item.key === Array.from(props.algo)[0] as algosKeys)?.name}`);
    }
    else if (mazeGenerationAlgorithms.find((item) => item.key === Array.from(props.algo)[0] as algosKeys)) {
      setAlgorithmDescription(mazeGenerationAlgorithms.find((item) => item.key === Array.from(props.algo)[0] as algosKeys)?.description);
      setAlgorithmName(`Name: ${mazeGenerationAlgorithms.find((item) => item.key === Array.from(props.algo)[0] as algosKeys)?.name}`);
    }

    if (algorithmDescription === undefined)
      setAlgorithmDescription("chouse an algorithm first");
    if (algorithmName === undefined)
      setAlgorithmName("");
  }, [props.algo, algorithmDescription, algorithmName])


  return (
    <>
      <Card className="max-w-[400px]">
        <CardHeader>
          <h4>Algorithm Description</h4>
        </CardHeader>
        <Divider />
        <CardBody>
          <p>
            {algorithmName}
          </p>
          <br />
          {
            (() => {
              const paragraphs = algorithmDescription?.split("@");
              if (paragraphs)
                return paragraphs.map((para, index, array) => <><p>{para}</p>{index !== array.length - 1 ? <br /> : ""}</>)
              return "";
            })()
          }
        </CardBody>
        <Divider />
      </Card >
    </>
  );
};
