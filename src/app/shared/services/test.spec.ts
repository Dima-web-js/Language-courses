// Задача 1 — базовая логика

// Есть функция:

// function multiply(a: number, b: number): number {
//   return a * b;
// }
// Нужно написать тесты:
// возвращает 6 для (2, 3)
// возвращает 0 если один из аргументов 0
// возвращает отрицательное число для (2, -3)


describe('multiply', ()=> {
  let result: number = 0;
  let a: number = 0;
  let b: number= 0;

  it('should return a result of multiplication 2 & 3', ()=> {
    a= 2;
    b= 3;

    result = multiply(a, b);
    expect(result).toBe(6);
  }
 );

 it('should return a result of multiplication 2 & 3', () => {
  a= 0;
  b= 0;
  result = multiply(a, b);
  expect(result).toBe(0);

 });

 it('should return a result of multiplication 2 & -3', ()=>{
  a = 2;
  b = -3;
  result = multiply(a, b);
  expect(result).toBe(-6);

 })




  } 
)

// function canAccess(isAuth: boolean, isAdmin: boolean): boolean {
//   return isAuth && isAdmin;
// }

describe('checking canAccess function ', ()=> {
  it('true+true = true', () => {
    let isAuth: boolean = true;
    let isAdmin: boolean = true;

    let result = canAccess(isAuth, isAdmin);
    expect(result).toBeTruthy();

  })

  it('true+false=false', () => { 
    let isAuth: boolean = true;
    let isAdmin: boolean = false;

    let result = canAccess(isAuth, isAdmin);
    expect(result).toBeFalsy();
    
  })

  it('false+true=false', () => {
    let isAuth: boolean = false;
    let isAdmin: boolean = true;

    let result = canAccess(isAuth, isAdmin);
    expect(result).toBeFalsy();
    
  })

  it('false+false=false', () => {
    let isAuth: boolean = false;
    let isAdmin: boolean = false;

    let result = canAccess(isAuth, isAdmin);
    expect(result).toBeFalsy();
    
  })


} )

// Задача 3 — работа со строками
// function formatName(firstName: string, lastName: string): string {
//   return `${firstName} ${lastName}`;
// }
// Проверить:
// "John", "Doe" → "John Doe"
// пустое имя
// пустая фамилия

describe('checking formatName function', ()=> {
  it('"John", "Doe" → "John Doe"', () => {
    const name: string = 'John';
    const lastName: string = 'Doe';

    const result = formatName(name, lastName);
    expect(result).toBe('John Doe');

  })

  it('empty name', () => { 
    const name: string = '';
    const lastName: string = 'Doe';

    const result = formatName(name, lastName);
    expect(result).toBe(' Doe');

    
  })

  it('empty surname', () => {
    const name: string = 'John';
    const lastName: string = '';

    const result = formatName(name, lastName);
    expect(result).toBe(' John');

    
  })
} )