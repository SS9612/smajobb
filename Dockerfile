FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["Smajobb/Smajobb.csproj", "Smajobb/"]
RUN dotnet restore "Smajobb/Smajobb.csproj"
COPY . .
WORKDIR "/src/Smajobb"
RUN dotnet build "Smajobb.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Smajobb.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Smajobb.dll"]
