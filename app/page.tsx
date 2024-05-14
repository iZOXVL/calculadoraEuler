"use client"; 
import { useState } from 'react';
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, Chip, Spinner} from "@nextui-org/react";
import confetti from 'canvas-confetti';

interface Resultado {
  vuelta: number;
  x: string;
  y: string;
  y_final: number;
  y_real: string;
  error: string;
}

export default function Home() {
  const handleConfetti = () => {
    confetti();
  };

  const [numVueltas, setNumVueltas] = useState('');
  const [valorInicialX, setValorInicialX] = useState('');
  const [valorInicialY, setValorInicialY] = useState('');
  const [valorH, setValorH] = useState('');
  const [coeficiente, setCoeficiente] = useState('');
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga

  const handleCalculate = async () => {
    setIsLoading(true); // Inicia la carga
    const response = await fetch('https://python-gig.replit.app/solve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        x0: Number(valorInicialX),
        y0: Number(valorInicialY),
        h: Number(valorH),
        n: Number(numVueltas),
        coefficient: Number(coeficiente)
      })
    });

    const data = await response.json();
    const results = data.x_values.map((x: number, index: number) => ({
      vuelta: index,
      x: x.toFixed(6),
      y: data.y_euler[index].toFixed(6),
      y_final: data.y_final_euler,
      y_real: data.y_real[index].toFixed(6),
      error: data.error_absoluto[index].toFixed(6)
    }));

    setResultados(results);
    setIsLoading(false); // Termina la carga
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen py-4">
      <h1 className="text-6xl font-bold title mb-8 text-left">Calculadora de Euler</h1> 
      <div className="grid grid-cols-3 gap-4 w-11/12 shadow-lg mb-12"> 
        <Card className="col-span-1 shadow-lg"> 
          <CardHeader>
            <CardTitle>Datos</CardTitle>
            <CardDescription>Ingresa los valores que indica el problema</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="w-full flex flex-col gap-4">
              <Input size={'md'} type="number" label="Número de vueltas" required onChange={(e) => setNumVueltas(e.target.value)} />
              <Input size={'md'} type="number" label="Valor inicial de x" required onChange={(e) => setValorInicialX(e.target.value)} />
              <Input size={'md'} type="number" label="Valor inicial de y" required onChange={(e) => setValorInicialY(e.target.value)} />
              <Input size={'md'} type="number" label="Valor de h" required onChange={(e) => setValorH(e.target.value)} />
              <Input size={'md'} type="number" label="Valor del coeficiente" required onChange={(e) => setCoeficiente(e.target.value)} />
              <Button className="btnbg" onClick={handleCalculate}>Calcular operación</Button>  
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle>Resultados</CardTitle>
            <CardDescription>Estos son los resultados en cada vuelta que generó la ecuación</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-8">
            {isLoading ? (
              <Spinner label="Calculando..." color="default" />
            ) : (
              <Table aria-label="Euler Method Results" isHeaderSticky isStriped classNames={{
                base: "max-h-[400px] overflow-scroll",
                table: "min-h-[400px]",
              }}>
                <TableHeader>
                  <TableColumn>Vuelta</TableColumn>
                  <TableColumn>Valor de X</TableColumn>
                  <TableColumn>Valor de Y</TableColumn>
                  <TableColumn>Valor Real de Y</TableColumn>
                  <TableColumn>Error absoluto</TableColumn>
                </TableHeader>
                <TableBody>
                  {resultados.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-white"><Chip className="btnbg">{result.vuelta}</Chip></TableCell>
                      <TableCell className="text-white"><Chip className="btnbg">{result.x}</Chip></TableCell>
                      <TableCell className="text-white"><Chip className="btnbg">{result.y}</Chip></TableCell>
                      <TableCell className="text-white"><Chip className="btnbg">{result.y_real}</Chip></TableCell>
                      <TableCell className="text-white"><Chip className="btnbg">{result.error}</Chip></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      <Button
        disableRipple
        className="relative overflow-visible rounded-full hover:-translate-y-1 px-12 shadow-xl bg-background/30 after:content-[''] after:absolute after:rounded-full after:inset-0 after:bg-background/40 after:z-[-1] after:transition after:!duration-70000 hover:after:scale-150 hover:after:opacity-0"
        size="lg"
        onPress={handleConfetti}
      >
        Desarrollado con 🤎 por Gigdem Cossette
      </Button>
    </div>
  );
}
