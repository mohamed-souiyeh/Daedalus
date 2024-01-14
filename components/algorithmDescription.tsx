import { Card, CardBody, CardFooter, CardHeader, Divider } from "@nextui-org/react";


export const AlgorithmDescription = () => {




  return (
    <>
      <Card className="max-w-[400px]">
        <CardHeader>
          <h4>Algorithm Description</h4>
        </CardHeader>
        <Divider />
        <CardBody>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            voluptatum, voluptate, quibusdam, quas voluptatibus voluptates
            voluptas nemo quos laboriosam atque repellendus? Quisquam voluptatum,
            voluptate, quibusdam, quas voluptatibus voluptates voluptas nemo
            quos laboriosam atque repellendus? Quisquam voluptatum, voluptate,
            quibusdam, quas voluptatibus voluptates voluptas nemo quos
            laboriosam atque repellendus?
          </p>
        </CardBody>
        <Divider />
        <CardFooter>
          <p>
            here are some ressources to learn more about this algorithm:
          </p>
        </CardFooter>
      </Card>
    </>
  );
};